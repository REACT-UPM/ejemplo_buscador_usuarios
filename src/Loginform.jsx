import React, { useState } from 'react';

/*
 * Formulario de login.
 *
 * Este componente solo hace dos cosas: RECOGER el usuario y la contraseña y
 * pasárselos a App mediante props.auth(). No sabe nada de fetch, de tokens ni
 * de localStorage. Toda la lógica de autenticación está en App.jsx.
 *
 * Props:
 *   - auth(username, password): función de App que hace el login contra dummyjson.
 */
export default function Loginform(props) {
    // showform: estado local de la interfaz. ¿Mostramos el botón "Iniciar sesión"
    // o el formulario? Solo le importa a este componente, así que vive aquí.
    const [showform, setShowform] = useState(false);
    // Inputs CONTROLADOS: React guarda en el estado lo que escribe el usuario
    // (value + onChange), así lo tenemos a mano al enviar.
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const sendForm = async (event) => {
      // Por defecto, enviar un <form> hace que el navegador navegue a otra URL y
      // la página se RECARGUE (perderíamos todo el estado de React).
      // preventDefault() lo evita: el envío lo hacemos nosotros con fetch, desde App.
      event.preventDefault();
      // "Levantamos" los datos al padre: App hará la petición y guardará el token.
      props.auth(username, password);
      setShowform(false);
    }

    return (<div id="loginform">                
          {!showform ? <button className="authbutton" onClick={()=>setShowform(true)}>Iniciar sesión</button>:<form>
            <input type="text" placeholder="Usuario" value={username} onChange={e=>setUsername(e.target.value)} ></input>
            {/* type="password" oculta los caracteres en pantalla. Solo es visual:
                la contraseña viaja igual; lo que la protege es usar HTTPS. */}
            <input type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)}></input>
            <button onClick={(e)=>sendForm(e)}>Enviar</button>
            {/* type="button": dentro de un <form>, un <button> es por defecto
                type="submit" y enviaría el formulario (recargando la página).
                Con type="button" solo ejecuta su onClick. */}
            <button type="button" onClick={()=>setShowform(false)}>Cancelar</button>
          </form>}        
      </div>)

}