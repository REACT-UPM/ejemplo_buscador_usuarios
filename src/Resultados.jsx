
export default function Resultados(props) {

	if(props.resultado.length === 0){
		return (<p id="sinresultados">No se ha encontrado ningún usuario</p>);
	}

	return (<div>
    <ul id="resultados">
      {props.resultado.map(item => (
        <li key={item.id}>          
          <p>Nombre: <b>{item.firstName}</b> {item.lastName}</p>
          <p>Email: {item.email}</p>
          <p><img src={item.image} alt={`Imagen de ${item.firstName} ${item.lastName}`}/></p>
          {/* El botón Borrar solo se muestra si hay un usuario autenticado.
              OJO: ocultar un botón NO es seguridad. Cualquiera podría lanzar el
              DELETE a mano (con curl, Postman o la consola). La protección real
              está en el SERVIDOR, que rechaza la petición (401) si no lleva
              un token válido en la cabecera Authorization. */}
          {props.authuser && <button onClick={()=>props.deleteUser(item.id)}>Borrar</button>}
        </li>
      ))}
    </ul>

  </div>)
}