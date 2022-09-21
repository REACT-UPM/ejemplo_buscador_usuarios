import { LanguageContext } from "./LanguageProvider";
import { useContext } from "react";

export default function Tarjeta(props){
  const langContext = useContext(LanguageContext);

  return(<li key={props.item.id}>          
    <p>{langContext.strings.name} <b>{props.item.firstName}</b> {props.item.lastName}</p>
    <p>{langContext.strings.email} {props.item.email}</p>
    <p><img src={props.item.image} alt="Imagen de {props.item.firstName}"/></p>
  </li>)
}