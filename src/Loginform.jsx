import React, { useState } from 'react';

export default function Loginform(props) {  
    const [showform, setShowform] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    return (<div id="loginform">                
          {!showform ? <button className="authbutton" onClick={()=>setShowform(true)}>Iniciar sesión</button>:<form>
            <input type="text" placeholder="Usuario" value={username} onChange={e=>setUsername(e.target.value)} ></input>
            <input type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)}></input>
            <button onClick={()=>props.auth(username, password)}>Enviar</button>
            <button onClick={()=>setShowform(false)}>Cancelar</button>
          </form>}        
      </div>)

}