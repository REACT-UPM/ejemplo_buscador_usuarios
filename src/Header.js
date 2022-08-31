export default function Header(props) {  
    return (<div id="cabecera">
      <img className="logo" src={process.env.PUBLIC_URL + "/sun.webp"} alt="logo" />
      <h3 className="mensaje">Bienvenido a la página de Enrique Barra</h3>      
    </div>)
  }
