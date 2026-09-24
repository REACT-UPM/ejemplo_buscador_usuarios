import { useState } from "react";
import Resultados from "./Resultados";
import Header from "./Header";
import './App.css';
import {mock1} from "./constants/users.js";
import CONFIG from "./config/config";

const USE_SERVER = CONFIG.use_server;

function App() {
  const [query, setQuery] = useState("");
  const [resultado, setResultado] = useState(null);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    callServer();
  }

  return (
    <div id="main">
        <Header />
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
        {!loading && resultado && <Resultados resultado={resultado} />}	
			</div>
  );
}

export default App;
