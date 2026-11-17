import React, { useState } from 'react';
import Loginform from './Loginform';

/*
 * Cabecera de la página.
 *
 * Props:
 *   - authuser: nombre del usuario autenticado, o null si no hay sesión.
 *   - auth(user, password): función de login de App (se la pasamos a Loginform).
 *   - logout(): función de App para cerrar la sesión.
 *
 * Header no guarda ningún estado de autenticación: solo PINTA según authuser
 * y reenvía las funciones de App. Este paso de props de padre a nieto
 * (App -> Header -> Loginform) se llama "prop drilling". Si hubiera muchos
 * niveles, sería mejor usar un Context de React (en la rama "context" tenéis
 * un ejemplo de Context aplicado al idioma).
 */
export default function Header(props) {

    return (<div id="cabecera">
      <img className="logo" src={import.meta.env.BASE_URL + "sun.webp"} alt="logo" />
      <h3 className="mensaje">Bienvenido a la página de Enrique Barra</h3> 
      <div className="derecha">
        {/* Renderizado condicional con el operador ternario:
            - con sesión:  nombre del usuario + botón "Cerrar sesión"
            - sin sesión:  formulario de login */}
        {props.authuser ? <div>
          <span className="authuser">{props.authuser}</span>
          <button className="authbutton" onClick={()=>props.logout()}>Cerrar sesión</button>
        </div>:<Loginform auth={props.auth} />}
      </div>
    </div>)
  }
