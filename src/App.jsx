import { useState } from "react";
import Resultados from "./Resultados";
import Header from "./Header";
import './App.css';
import {mock1} from "./constants/users.js";
import CONFIG from "./config/config";

const USE_SERVER = CONFIG.use_server;

//ideas:
//probar response.status y si no es 200 poner un error en pantalla
//
function App() {
  const [query, setQuery] = useState("");
  const [resultado, setResultado] = useState(null);
  const [authuser, setAuthuser] = useState(null);
  const [token, setToken] = useState(null);
  const [autherror, setAutherror] = useState(null);


  const callServer = async (param) => {    
      if(USE_SERVER) {
        try {
          let queryparams = "";
          if(param==="all"){
            queryparams = "?limit=" + CONFIG.num_items;
          } else {
            queryparams = "/search?q=" + query;
          }
          const response = await fetch(`${CONFIG.server_url}${queryparams}`);
          const data = await response.json();         
          //console.log(data);
          setResultado(data.users);
        } catch (error) {
          console.log(error);
          setResultado({ error: {description: error.message} });
        }
      } else {
        //console.log(mock1.users)
        setResultado(mock1.users);
      }
  }

  const auth = async (user, password) => {
    console.log("autenticando", user);
    try{
      const login = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({        
          username: user,
          password: password,
          expiresInMins: 30
        })      
      });
      //check status
      if(login.status !== 200) {
        setAutherror("Error en la autenticación");
      } else {
        setAutherror(null);
        const data = await login.json();
        console.log(data);
        if(data.accessToken) {
          setAuthuser(user);
          setToken(data.accessToken);
        } else {
          setAuthuser(null);
          setToken(null);
        }
      }
    } catch (error) {
      console.log(error);
      setAuthuser(null);
      setToken(null);
    }
  }

  const logout = () => {
    setAuthuser(null);
    setToken(null);
  }

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

  return (
    <div id="main">
        <Header auth={auth} logout={logout}  authuser={authuser}  />
        {autherror && <h1 className="error" >{autherror}</h1>}
 				<h2 id="buscador">Buscador de usuarios</h2>
				<div><input type="text" id="query" placeholder="Texto a buscar" value={query} onChange={e=>setQuery(e.target.value)}></input></div>
				<br/>
        <button id="botonsearch" className="new" onClick={()=>callServer()}>
				  Buscar
				</button> 
        <button id="botonall" className="new" onClick={()=>callServer("all")}>
				  Ver Todos
				</button>        		
        {resultado && <Resultados numitems={CONFIG.num_items} resultado={resultado} authuser={authuser} deleteUser={deleteUser}/>}	
			</div>
  );
}

export default App;
