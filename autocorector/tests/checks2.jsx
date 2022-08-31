import {render, fireEvent, waitFor} from '@testing-library/react'
import App from '../../src/App';
import {mockdata} from "../utils/users2.js";

const mytestconfig = {
  server_url: "https://dummyjson.com/users",
  num_items: 20,  
  use_server: true,
  loading_timeout_ms: 2000
};

jest.setTimeout(10000);

jest.mock('../../src/config/config', () => ( {
  __esModule: true,
  default: mytestconfig  
} ));

afterAll(() => jest.resetAllMocks());

beforeEach(() => {
  jest.useFakeTimers()
});

// Running all pending timers and switching to real timers using Jest
afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
});


let testinfo = {
  name: "La aplicación hace fetch de datos del servidor remoto",
  score: 2,
  msg_ok: "La aplicación hace fetch correctamente",
  msg_error: "La aplicación NO hace fetch correctamente"
}
test(JSON.stringify(testinfo), async () => {
  global.fetch = jest.fn(() => Promise.resolve({
    status: 200,
    json: () => Promise.resolve(mockdata)
  }));

  render(<App />);
  const theinput = document.querySelector('#query');
  expect(theinput).toBeInTheDocument();
  const buscabtn = document.querySelector('#botonall');
  expect(buscabtn).toBeInTheDocument();  
  await fireEvent.click(buscabtn);
  
  //necesitamos waitFor porque hacemos un re-render asincrono después del fetch en App.js - https://davidwcai.medium.com/react-testing-library-and-the-not-wrapped-in-act-errors-491a5629193b
  //además he tenido que añadir await a fireEvent.click(buscar) para que funcione
  await waitFor(() => {
    const url = global.fetch.mock.calls[0][0];
    expect(url).toMatch(mytestconfig.server_url);
    expect(url).toMatch("?limit=" + mytestconfig.num_items);
    const productos = document.querySelectorAll('#resultados li');
    expect(productos.length).toBe(48);
  });
});

testinfo = {
  name: "La aplicación maneja el valor del input y filtra los resultados al pulsar el button",
  score: 2,
  msg_ok: "El input de la aplicación funciona correctamente y filtra al pulsar el botón",
  msg_error: "El input de la aplicación NO funciona correctamente o NO filtra al pulsar el botón"
}
test(JSON.stringify(testinfo), async () => {
  global.fetch = jest.fn(() => Promise.resolve({
    status: 200,
    json: () => Promise.resolve(mockdata)
  }));
  render(<App />);
  const theinput = document.querySelector('#query');
  expect(theinput).toBeInTheDocument();
  const buscabtn = document.querySelector('#botonsearch');
  expect(buscabtn).toBeInTheDocument();
  fireEvent.change(theinput, {target: {value: "john"}})
  expect(theinput).toHaveValue("john");
  await fireEvent.click(buscabtn);
  //necesitamos waitFor porque hacemos un re-render asincrono después del fetch en App.js - https://davidwcai.medium.com/react-testing-library-and-the-not-wrapped-in-act-errors-491a5629193b
  //además he tenido que añadir await a fireEvent.click(buscar) para que funcione
  await waitFor(() => {
    const url = global.fetch.mock.calls[0][0];
    expect(url).toMatch(mytestconfig.server_url);
    expect(url).toMatch("/search?q=john");
    const productos = document.querySelectorAll('#resultados li');
    expect(productos.length).toBe(48);
  });
});