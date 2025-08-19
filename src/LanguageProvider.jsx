import { createContext, useState } from "react";

export const LanguageContext = createContext({});

const langData = {
  "en": {
    name: "name",
    email: "email",
    search: "Search",
    seeall: "See all",
    textsearch: "Text to search"
  },
  "es": {
    name: "nombre",
    email: "correo",
    search: "Buscar",
    seeall: "Ver Todos",
    textsearch: "Texto a buscar"
  },
  "ca": {
    name: "nombrecatalan",
    search: "buscarencatalan",
    seeall: "catalan",
    textsearch: "en catalan"
  }
}

export function LanguageProvider(props) {
  const [lang, setLang] = useState("en");

  function switchLang(newLang){
    console.log("Vamos a cambiar el idioma a:", newLang);
    setLang(newLang);
  }

  const context = {
    language: lang,
    strings: langData[lang],
    switchLang: switchLang,
  };

  return (
    <LanguageContext value={context}>
      {props.children}
    </LanguageContext>
  );
};