import { useState } from "react";
import Resultados from "./Resultados";
import Header from "./Header";
import './App.css';
import {mock1} from "./constants/users.js";
import CONFIG from "./config/config";
import { useEffect } from "react";

const USE_SERVER = CONFIG.use_server;

/*
 * ============================================================================
 *  AUTENTICACIÓN CONTRA DUMMYJSON (rama "auth")
 * ============================================================================
 *  Esta rama añade al buscador un sistema de login basado en TOKENS (JWT).
 *  El flujo completo es:
 *
 *   1. El usuario escribe usuario y contraseña en <Loginform> (dentro de <Header>).
 *   2. Loginform llama a la función auth() que le pasamos por props desde App.
 *   3. auth() hace un POST a https://dummyjson.com/auth/login con las credenciales.
 *   4. Si son correctas, el servidor devuelve un "accessToken" (un JWT).
 *      Guardamos el usuario y el token en el estado de React Y en localStorage.
 *   5. Con el token guardado, las peticiones que requieren estar autenticado
 *      (como borrar un usuario) lo envían en la cabecera HTTP:
 *          Authorization: Bearer <token>
 *   6. Al recargar la página, un useEffect recupera el token de localStorage
 *      para no tener que volver a hacer login.
 *   7. logout() borra el token del estado y de localStorage.
 *
 *  ¿Por qué el estado vive en App y no en Loginform o Header?
 *  Porque varios componentes necesitan saber si hay alguien autenticado:
 *    - Header: para mostrar el formulario de login o el nombre + "Cerrar sesión".
 *    - Resultados: para mostrar u ocultar el botón "Borrar".
 *  Por eso "elevamos el estado" (lifting state up) al antepasado común (App)
 *  y lo pasamos hacia abajo por props, junto con las funciones que lo modifican.
 * ============================================================================
 */

function App() {
  const [query, setQuery] = useState("");
  const [resultado, setResultado] = useState(null);

  // --- Estado de autenticación ---
  // authuser: nombre del usuario autenticado, o null si no hay sesión.
  //           Lo usamos como "bandera" para saber si estamos logueados.
  const [authuser, setAuthuser] = useState(null);
  // token: el accessToken (JWT) que nos da dummyjson. Es nuestra "credencial"
  //        para las peticiones protegidas. Nunca guardamos la contraseña.
  const [token, setToken] = useState(null);
  // autherror: mensaje que mostramos si el login falla.
  const [autherror, setAutherror] = useState(null);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const callServer = async (param) => {    
      setLoading(true);
      if(USE_SERVER) {
        try {
          setError(null);
          let queryparams = "";
          if(param==="all"){
            queryparams = "?limit=" + CONFIG.num_items;
          } else {
            queryparams = "/search?q=" + encodeURIComponent(query);
          }
          const response = await fetch(`${CONFIG.server_url}${queryparams}`);
          if(response.status !== 200){
            throw new Error(`El servidor ha respondido con un ${response.status}`);
          }
          const data = await response.json();         
          //console.log(data);
          setResultado(data.users ?? []);
        } catch (err) {
          console.log(err);
          setError(err.message);
          setResultado(null);
        } finally {
          setLoading(false);
        }
      } else {
        //los datos de prueba son instantaneos, simulamos el retardo de la red
        //para que de tiempo a ver el mensaje de carga
        setTimeout(() => {
          setResultado(mock1.users);
          setLoading(false);
        }, CONFIG.loading_timeout_ms);
      }
  }

  /*
   * LOGIN: auth(user, password)
   * ---------------------------
   * Se la pasamos a <Header> y este a <Loginform>, que la llama al enviar el
   * formulario. Así el formulario solo recoge los datos y App decide qué hacer.
   *
   * Documentación de la API: https://dummyjson.com/docs/auth
   *
   * Podéis probar con:
   *   USUARIO: emilys
   *   PASSWORD: emilyspass
   * (en https://dummyjson.com/users tenéis más usuarios con su username y password)
   */
  const auth = async (user, password) => {
    console.log("autenticando", user);
    try{
      // Las credenciales se envían con POST en el CUERPO de la petición, en JSON.
      // Nunca en la URL con GET: quedarían en el historial y en los logs del servidor.
      const login = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        // Le decimos al servidor que el cuerpo va en formato JSON
        headers: { 'Content-Type': 'application/json' },
        // fetch no convierte objetos a JSON por sí solo: hay que usar JSON.stringify
        body: JSON.stringify({
          username: user,
          password: password,
          expiresInMins: 30   // opcional: el token caduca a los 30 minutos
        })
      });
      // Si las credenciales son incorrectas, dummyjson responde con un 400.
      // OJO: fetch NO lanza una excepción ante un 4xx o un 5xx; solo lo hace si
      // falla la red. Por eso hay que comprobar el código de estado a mano.
      if(login.status !== 200) {
        setAutherror("Error en la autenticación");
      } else {
        setAutherror(null);
        // Si va bien, la respuesta es un JSON como este:
        // { id, username, email, firstName, lastName, gender, image,
        //   accessToken: "eyJhbGciOi...", refreshToken: "eyJhbGciOi..." }
        const data = await login.json();
        console.log(data);
        if(data.accessToken) {
          // 1) Lo guardamos en el estado de React -> provoca un re-render y
          //    Header/Resultados se pintan ya como "usuario autenticado".
          setAuthuser(user);
          setToken(data.accessToken);
          // 2) Lo guardamos también en localStorage para que la sesión
          //    sobreviva a una recarga de la página (ver el useEffect de abajo).
          //    localStorage solo guarda strings, como clave -> valor.
          //    AVISO: cualquier JavaScript que se ejecute en la página puede leer
          //    localStorage, así que si la web tiene una vulnerabilidad XSS,
          //    pueden robar el token. En producción se suelen usar cookies
          //    HttpOnly. Para esta práctica, localStorage es suficiente.
          localStorage.setItem('authuser', user);
          localStorage.setItem('token', data.accessToken);
        } else {
          setAuthuser(null);
          setToken(null);
        }
      }
    } catch (error) {
      // Llegamos aquí si falla la red (sin conexión, error de CORS, etc.)
      console.log(error);
      setAuthuser(null);
      setToken(null);
    }
  }

  /*
   * LOGOUT
   * ------
   * Con tokens, "cerrar sesión" en el cliente consiste simplemente en olvidar
   * el token: lo borramos del estado y de localStorage. Al poner authuser a
   * null, la interfaz vuelve a mostrar el botón "Iniciar sesión" y desaparecen
   * los botones de borrar.
   * (El token sigue siendo válido en el servidor hasta que caduque, pero como
   * ya no lo tenemos, no podemos usarlo.)
   */
  const logout = () => {
    setAuthuser(null);
    setToken(null);
    localStorage.removeItem('authuser');
    localStorage.removeItem('token');
  }

  /*
   * PETICIÓN PROTEGIDA: borrar un usuario
   * -------------------------------------
   * Este es el objetivo de autenticarse: hacer peticiones que el servidor solo
   * acepta si demostramos quiénes somos.
   *
   * - Usamos el prefijo /auth/ en la URL (https://dummyjson.com/auth/users/...).
   *   En dummyjson, cualquier recurso con ese prefijo EXIGE un token válido.
   *   Sin token, o con uno caducado, responde con un 401 (Unauthorized).
   * - El token se envía en la cabecera "Authorization" con el esquema "Bearer"
   *   ("portador": quien lo lleva tiene acceso). El formato exacto es
   *       Authorization: Bearer <token>
   *   ¡con un espacio entre "Bearer" y el token!
   *
   * NOTA: dummyjson es una API de pruebas. El borrado es SIMULADO: responde
   * como si hubiera borrado el usuario ({ ..., isDeleted: true, deletedOn: ... }),
   * pero en realidad no borra nada. Por eso, si volvéis a buscar, el usuario
   * sigue apareciendo. Tampoco actualizamos aquí la lista "resultado".
   */
  const deleteUser = async (id) => {
    console.log("borrando", id);
    try{
      const resp = await fetch('https://dummyjson.com/auth/users/'+id, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
        }
      });
      const data = await resp.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }

  }

  /*
   * RECUPERAR LA SESIÓN AL CARGAR LA PÁGINA
   * ---------------------------------------
   * El estado de React se pierde al recargar la página (F5). Por eso, al montar
   * el componente, miramos si quedó un token en localStorage de una sesión
   * anterior y, si lo hay, lo volvemos a cargar en el estado.
   *
   * El array de dependencias vacío [] hace que este efecto se ejecute UNA sola
   * vez, después del primer render.
   * (En desarrollo, con <StrictMode>, veréis el console.log dos veces: es normal.)
   *
   * Mejora posible: el token puede haber caducado (pusimos expiresInMins: 30).
   * Para comprobar si sigue siendo válido, se puede hacer un GET a
   * https://dummyjson.com/auth/me con la cabecera Authorization: si responde
   * 401, hay que llamar a logout().
   */
  useEffect(() => {
    console.log("checking local storage for token");
    const token = localStorage.getItem('token');
    const authuser = localStorage.getItem('authuser');
    console.log("found", token, authuser);
    if(token && authuser) {
      setToken(token);
      setAuthuser(authuser);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    callServer();
  }

  return (
    <div id="main">
        {/* Header recibe las funciones auth y logout (para cambiar el estado de
            App desde un hijo) y authuser (para saber qué pintar). */}
        <Header auth={auth} logout={logout}  authuser={authuser}  />
        {/* Renderizado condicional: el mensaje de error solo aparece si autherror no es null */}
        {autherror && <h1 className="error" >{autherror}</h1>}
 				<h2 id="buscador">Buscador de usuarios</h2>
        <form onSubmit={handleSubmit}>
				<div><input type="text" id="query" placeholder="Texto a buscar" value={query} onChange={e=>setQuery(e.target.value)}></input></div>
				<br/>
        <button id="botonsearch" type="submit" className="new">
				  Buscar
				</button> 
        <button id="botonall" type="button" className="new" onClick={()=>callServer("all")}>
				  Ver Todos
				</button>        		
        </form>
        {error && <p id="error">Ha ocurrido un error: {error}</p>}
        {loading && <p id="cargando">Buscando...</p>}
        {/* A Resultados le pasamos authuser (para mostrar u ocultar el botón Borrar)
            y deleteUser. El token NO se pasa: se queda encapsulado en App. */}
        {!loading && resultado && <Resultados numitems={CONFIG.num_items} resultado={resultado} authuser={authuser} deleteUser={deleteUser}/>}	
        
    </div>
  );
}

export default App;
