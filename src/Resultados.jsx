
export default function Resultados(props) {
	return (<div>
    <ul id="resultados">
      {props.resultado.map(item => (
        <li key={item.id}>          
          <p>Nombre: <b>{item.firstName}</b> {item.lastName}</p>
          <p>Email: {item.email}</p>
          <p><img src={item.image} alt="Imagen de {item.firstName}"/></p>
        </li>
      ))}
    </ul>

  </div>)
}