import {render, fireEvent, waitFor, act} from '@testing-library/react'
import App from '../../src/App';
import Header from '../../src/Header';
import Resultados from '../../src/Resultados';
import user_info from '../../user.json';
import {mockdata} from "../utils/users.js";


const mytestconfig = {
  server_url: "https://dummyjson.com/users",
  num_items: 30,  
  use_server: false,
  loading_timeout_ms: 2000
};

jest.setTimeout(10000);

jest.mock('../../src/config/config', () => ( {
  __esModule: true,
  default: mytestconfig  
} ));

afterAll(() => jest.resetAllMocks());

beforeAll(() => {
  jest.useFakeTimers()
});

// Running all pending timers and switching to real timers using Jest
afterAll(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
});


let testinfo = {
    name: "La aplicación tiene un componente Header con el logo y el mensaje de bienvenida con tu nombre",
    score: 2,
    msg_ok: "Header encontrada",
    msg_error: "Header no encontrada o no es como se esperaba, revise el enunciado"
}
test(JSON.stringify(testinfo), () => {
  render(<Header />);
  const cabecera = document.querySelector('#cabecera');
  const logo = document.querySelector('.logo');
  const mensaje = document.querySelector('.mensaje');

  expect(cabecera).toBeInTheDocument();
  expect(user_info).toHaveProperty('name');
  expect(user_info).toHaveProperty('email');
  expect(user_info).toHaveProperty('token');
  expect(mensaje).toHaveTextContent(new RegExp(user_info.name, 'i'));
  expect(cabecera.tagName).toBe('DIV');
  expect(cabecera).toContainElement(logo);
  expect(cabecera).toContainElement(mensaje);
});


testinfo = {
  name: "La aplicación tiene al menos un h2, un input y un button",
  score: 2,
  msg_ok: "Componente con h2, input y button correctos",
  msg_error: "La app no tiene el h2, input y button correctos"
}
test(JSON.stringify(testinfo), () => {
  render(<App />);
  const buscador = document.querySelector('#buscador');
  expect(buscador).toBeInTheDocument();
  expect(buscador).toHaveTextContent(/Buscador de usuarios/i);
  expect(buscador.tagName).toBe('H2');
  const theinput = document.querySelector('#query');
  expect(theinput).toBeInTheDocument();
  expect(theinput.tagName).toBe('INPUT');
  const buscabtn = document.querySelector('#botonsearch');
  expect(buscabtn).toBeInTheDocument();
  expect(buscabtn.tagName).toBe('BUTTON');
});


testinfo = {
  name: "La aplicación tiene un componente Resultados que renderiza los productos que recibe",
  score: 2,
  msg_ok: "Componente Resultados encontrado productos renderizados",
  msg_error: "El componente Resultados no se ha encontrado o no renderiza correctamente los productos"
}
test(JSON.stringify(testinfo), () => {
  render(<Resultados resultado={mockdata.users} />);
  const productos = document.querySelectorAll('#resultados li');
  expect(productos.length).toBe(50);
});




