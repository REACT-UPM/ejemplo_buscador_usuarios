export default function Header() {  
    return (<div id="cabecera">
      <img className="logo" src={import.meta.env.BASE_URL + "sun.webp"} alt="logo" />
      <h3 className="mensaje">Bienvenido a la página de Enrique Barra</h3>      
    </div>)
  }
