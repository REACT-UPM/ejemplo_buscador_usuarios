import { useState, useContext } from "react";
import Resultados from "./Resultados";
import Header from "./Header";
import './App.css';
import {mock1} from "./constants/users.js";
import CONFIG from "./config/config";
import { LanguageContext } from "./LanguageProvider";

const USE_SERVER = CONFIG.use_server;

//falta probar response.status y si no es 200 poner un error en pantalla
function App() {
  const [query, setQuery] = useState("");
  const [resultado, setResultado] = useState(null);

  const langContext = useContext(LanguageContext);

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

  const cambiaLang = (newlang)=>{
    langContext.switchLang(newlang);
  }

  return (
      <div id="main">
          <Header />
          <h2 id="buscador">Buscador de usuarios</h2>
          <a href="#" onClick={()=>cambiaLang("en")}>en</a>
          /
          <a href="#" onClick={()=>cambiaLang("es")}>es</a>
          <div><input type="text" id="query" placeholder="Texto a buscar" value={query} onChange={e=>setQuery(e.target.value)}></input></div>
          <br/>
          <button id="botonsearch" className="new" onClick={()=>callServer()}>
            {langContext.strings.search}
          </button> 
          <button id="botonall" className="new" onClick={()=>callServer("all")}>
            {langContext.strings.seeall}
          </button>        		
          {resultado && <Resultados numitems={CONFIG.num_items} resultado={resultado} />}	
        </div>
  );
}

export default App;
