import React, { useState } from 'react';
import Loginform from './Loginform';

export default function Header(props) {

    return (<div id="cabecera">
      <img className="logo" src={import.meta.env.BASE_URL + "/sun.webp"} alt="logo" />
      <h3 className="mensaje">Bienvenido a la página de Enrique Barra</h3> 
      <div className="derecha">        
        {props.authuser ? <div>
          <span className="authuser">{props.authuser}</span>
          <button className="authbutton" onClick={()=>props.logout()}>Cerrar sesión</button>
        </div>:<Loginform auth={props.auth} />}
      </div>
    </div>)
  }
