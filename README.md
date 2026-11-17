# Buscador de usuarios

Ejemplo de **SPA (Single Page Application) con React 19 y Vite**. La aplicación
tiene un buscador que consulta usuarios contra una API remota y muestra los
resultados en pantalla.

Es el primer ejemplo completo de la asignatura: cubre estado con `useState`,
paso de props entre componentes, renderizado de listas, llamadas asíncronas con
`fetch` y manejo de errores.

---

## 1. Requisitos previos

Necesitas **Node.js 20.19 o superior** (o bien 22.12 o superior). Es un
requisito de Vite 7, y si tienes una versión anterior la instalación fallará con
un mensaje poco claro. Comprueba la tuya con:

```
node -v
```

Si no lo tienes o tienes una versión antigua, descárgalo de
[nodejs.org](https://nodejs.org/). Los ejemplos de abajo usan `yarn`, pero
`npm` funciona igual de bien.

## 2. Instalar las dependencias

Abre un terminal en la raíz del proyecto (la carpeta donde está este README) y
ejecuta:

```
yarn
```

Esto descarga React y el resto de librerías dentro de `node_modules/`. Solo hay
que hacerlo una vez, o cuando cambien las dependencias.

## 3. Arrancar la aplicación

```
yarn dev
```

Verás algo parecido a esto:

```
  VITE v7.1.3  ready in 372 ms

  ➜  Local:   http://localhost:5173/
```

Abre <http://localhost:5173/> en el navegador. La página se recarga sola cada
vez que guardas un fichero, así que deja el servidor corriendo mientras
trabajas. Para pararlo, `Ctrl+C` en el terminal.

---

## Cómo está organizado el código

```
index.html            página HTML que carga la aplicación
src/
  main.jsx            punto de entrada: monta <App /> en el <div id="root">
  App.jsx             componente principal: estado, búsqueda y llamada al servidor
  Header.jsx          cabecera con el logo y el mensaje de bienvenida
  Resultados.jsx      pinta la lista de usuarios que recibe por props
  config/config.js    configuración de la aplicación (ver abajo)
  constants/users.js  datos de prueba, para trabajar sin conexión
  App.css             estilos
public/               ficheros servidos tal cual (sun.webp, vite.svg)
```

El flujo es: `App` guarda en su estado lo que el usuario escribe y lo que
devuelve el servidor, y le pasa los resultados a `Resultados` por props.

## Configuración

En [src/config/config.js](src/config/config.js):

| Opción | Para qué sirve |
|---|---|
| `server_url` | Dirección de la API. Por defecto `https://dummyjson.com/users`. |
| `num_items` | Cuántos usuarios pedir al pulsar "Ver Todos". |
| `use_server` | `true` llama a la API real; `false` usa los datos de `constants/users.js`. |
| `loading_timeout_ms` | Retardo simulado cuando `use_server` es `false`, para que se vea el mensaje de carga. |

Poner `use_server: false` es útil para trabajar sin conexión o si la API está
caída. Con datos de prueba la respuesta sería instantánea, así que se simula un
retardo para que el estado de carga se aprecie igual que con el servidor real.

## Comandos disponibles

| Comando | Qué hace |
|---|---|
| `yarn dev` | Arranca el servidor de desarrollo en el puerto 5173. |
| `yarn build` | Genera la versión de producción en `dist/`. |
| `yarn preview` | Sirve lo que hay en `dist/` para comprobarlo antes de entregar. |

---

## Corregir y entregar la práctica

La corrección se hace con la herramienta **autoCOREctor**, desde la raíz del
proyecto:

```
npx autocorector
```

La primera vez te pedirá tu correo de matrícula y un **token de Moodle**. Para
conseguirlo: entra en Moodle → menú de tu usuario → *Preferencias* → *Claves de
seguridad*, y copia la clave del servicio "autocorrección".

Puedes ejecutarlo tantas veces como quieras: te da la nota y te dice qué falla,
sin entregar nada. Cuando estés conforme, haz efectiva la entrega con:

```
npx autocorector --upload
```

Tus datos quedan guardados en `user.json`. Ese fichero **contiene tu token
personal y no debe subirse a git ni compartirse con nadie** (ya está listado en
`.gitignore`).

## Problemas frecuentes

**El puerto 5173 está ocupado.** Vite elegirá otro automáticamente; mira la URL
que imprime en el terminal, o arranca con `yarn dev --port 3000`.

**Errores raros al instalar o arrancar.** Comprueba primero tu versión de Node
con `node -v` (necesitas 20.19+ o 22.12+). Si sigue fallando, borra
`node_modules/` y vuelve a ejecutar `yarn`.

**No se ven resultados y la consola muestra un error de red.** La API pública
puede estar caída o sin conexión. Pon `use_server: false` en
`src/config/config.js` para seguir trabajando con los datos de prueba.
