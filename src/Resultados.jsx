
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
        </li>
      ))}
    </ul>

  </div>)
}