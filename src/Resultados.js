import Tarjeta from "./Tarjeta"

export default function Resultados(props) {
	return (<div>
    <ul id="resultados">
      {props.resultado.map(item => (
        <Tarjeta item={item}/>
      ))}
    </ul>

  </div>)
}