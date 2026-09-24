/**
 * App - Buscador de usuarios (versión React 19).
 *
 * DIFERENCIA CON LA RAMA "solucion"
 * ---------------------------------
 * En la rama "solucion" esta misma pantalla se monta "a mano":
 *
 *   - tres useState (resultado, error, loading)
 *   - una función async que hace el fetch y va llamando a los tres setters
 *   - setLoading(true) al empezar y setLoading(false) en un finally
 *   - un onSubmit con e.preventDefault()
 *
 * Aquí se usan las dos herramientas que React 19 trae para justo este caso:
 * un formulario que dispara una operación asíncrona.
 *
 *   - useActionState: recibe una función "acción" y guarda lo que esa acción
 *     devuelve. Nos da el estado, la función que se le pasa al form y un
 *     booleano "pendiente" que React mantiene solo. Desaparecen el estado
 *     loading, el finally y el preventDefault.
 *
 *   - useTransition: sirve para lanzar una acción sin formulario de por medio,
 *     que es el caso del botón "Ver Todos".
 *
 * Además el input pasa a ser NO controlado: su valor ya no vive en una
 * variable de estado, lo lee la acción del FormData al enviarse. Con eso este
 * componente se queda sin una sola llamada a useState.
 *
 * Lo que NO cambia: el corrector sigue buscando los mismos ids y el componente
 * Resultados es exactamente el mismo.
 */
import { useActionState, useTransition } from "react";
import Resultados from "./Resultados";
import Header from "./Header";
import './App.css';
import {mock1} from "./constants/users.js";
import CONFIG from "./config/config";

const USE_SERVER = CONFIG.use_server;

// Todo el resultado de la búsqueda vive en un único objeto. En la rama
// "solucion" esto eran dos useState separados (resultado y error); aquí es el
// valor que devuelve la acción, así que tiene que ir junto.
const ESTADO_INICIAL = { resultado: null, error: null };

/**
 * Acción del formulario.
 *
 * useActionState impone esta firma: recibe el estado anterior y el FormData del
 * formulario, y DEVUELVE el estado nuevo. Fíjate en que aquí no hay ni un solo
 * setX(): la función no toca el estado, solo calcula el siguiente valor. React
 * se encarga de guardarlo y de volver a pintar.
 *
 * Por eso puede estar fuera del componente: no necesita nada de dentro.
 *
 * @param {Object}   estadoPrevio  lo que devolvió la llamada anterior
 * @param {FormData} formData      contenido del formulario al enviarse
 * @returns {Promise<{resultado: Array|null, error: string|null}>}
 */
async function buscarUsuarios(estadoPrevio, formData) {
  // Los valores se leen del FormData, no de una variable de estado. El botón
  // "Ver Todos" mete la marca "vertodos" para distinguir las dos búsquedas.
  const texto = formData.get("query") ?? "";
  const verTodos = formData.get("vertodos") !== null;

  if(!USE_SERVER) {
    // Los datos de prueba son instantáneos: simulamos el retardo de la red para
    // que dé tiempo a ver el indicador de carga. En la rama "solucion" esto era
    // un setTimeout con callback; aquí basta con esperar, porque estamos dentro
    // de una función async.
    await new Promise(resolve => setTimeout(resolve, CONFIG.loading_timeout_ms));
    return { resultado: mock1.users, error: null };
  }

  try {
    const queryparams = verTodos
      ? "?limit=" + CONFIG.num_items
      : "/search?q=" + encodeURIComponent(texto);

    const response = await fetch(`${CONFIG.server_url}${queryparams}`);
    // Igual que en la otra rama: fetch no lanza excepción con un 404 o un 500.
    if(response.status !== 200){
      throw new Error(`El servidor ha respondido con un ${response.status}`);
    }
    const data = await response.json();
    return { resultado: data.users ?? [], error: null };
  } catch (err) {
    console.log(err);
    // En la rama "solucion" aquí había setError(...) y setResultado(null).
    // Ahora el error es, simplemente, parte del valor devuelto.
    return { resultado: null, error: err.message };
  }
}

function App() {
  // Este componente no tiene ni un useState: todo lo que hay que recordar está
  // o bien en el DOM (el texto del input) o bien en manos de useActionState.
  //
  // useActionState devuelve tres cosas:
  //   estado            -> lo último que devolvió buscarUsuarios()
  //   enviarFormulario  -> la función que se le pasa al <form action={...}>
  //   enviando          -> true mientras la acción está en marcha
  //
  // Ese tercer valor es el que sustituye al estado "loading" de la otra rama:
  // no hay que acordarse de encenderlo ni de apagarlo, y no hace falta finally.
  const [estado, enviarFormulario, enviando] = useActionState(buscarUsuarios, ESTADO_INICIAL);

  // useTransition hace falta para "Ver Todos", que no envía el formulario sino
  // que llama a la acción directamente desde un onClick. Para invocar una acción
  // por tu cuenta hay que hacerlo dentro de startTransition; si no, React no
  // sabría que es una actualización que puede tardar.
  const [enTransicion, startTransition] = useTransition();

  // Da igual por cuál de los dos caminos se haya pedido: la pantalla solo
  // necesita saber si hay algo en marcha.
  const cargando = enviando || enTransicion;

  const verTodos = () => {
    // Montamos a mano el FormData que el formulario habría enviado.
    const datos = new FormData();
    datos.set("vertodos", "1");
    startTransition(() => {
      enviarFormulario(datos);
    });
  };

  return (
    <div id="main">
      <Header />
      <h2 id="buscador">Buscador de usuarios</h2>

      {/* action={enviarFormulario} en lugar de onSubmit={handleSubmit}.
          React llama a la acción con el FormData y se encarga él del
          preventDefault: la página ya no se recarga sola. */}
      <form action={enviarFormulario}>
        {/* Input NO controlado: no lleva ni value ni onChange. Su valor lo
            guarda el propio DOM, y la acción lo recoge del FormData cuando se
            envía el formulario. En la rama "solucion" era controlado: un
            useState más un onChange que se ejecutaba en cada tecla.

            Controlado sigue siendo lo correcto si necesitas reaccionar a lo que
            se escribe (validar, filtrar según teclea, habilitar un botón). Si
            solo necesitas el valor al enviar, como aquí, sobra.

            El name es imprescindible: es la clave con la que la acción lo
            encuentra al hacer formData.get("query"). El id lo pide el corrector. */}
        <div><input type="text" id="query" name="query" placeholder="Texto a buscar" /></div>
        <br/>
        <button id="botonsearch" type="submit" className="new" disabled={cargando}>
          Buscar
        </button>
        {/* Sigue siendo type="button" para que no envíe el formulario: su
            camino es el onClick con startTransition. */}
        <button id="botonall" type="button" className="new" onClick={verTodos} disabled={cargando}>
          Ver Todos
        </button>
      </form>

      {/* El error y los resultados salen del mismo objeto de estado. */}
      {estado.error && <p id="error">Ha ocurrido un error: {estado.error}</p>}
      {cargando && <p id="cargando">Buscando...</p>}
      {!cargando && estado.resultado && <Resultados resultado={estado.resultado} />}
    </div>
  );
}

export default App;
