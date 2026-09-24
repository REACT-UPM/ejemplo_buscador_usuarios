# Práctica: Buscador de usuarios

Esqueleto de partida de la práctica. Es el resultado de `yarn create vite`
(React 19 + Vite) más la herramienta de autocorrección y los tests que tu
aplicación tendrá que pasar.

**Los requisitos de la práctica están en el enunciado**, no aquí. Este fichero
solo explica cómo poner el proyecto en marcha y cómo corregirlo y entregarlo.

---

## 1. Requisitos previos

Necesitas **Node.js 22.12 o superior** (o la versión 24 LTS). Comprueba la tuya:

```
node -v
```

Si tienes una versión anterior la instalación fallará con un mensaje poco
claro, así que mejor comprobarlo antes. Descarga desde
[nodejs.org](https://nodejs.org/). Los ejemplos usan `yarn`, pero `npm`
funciona igual.

## 2. Instalar las dependencias

Abre un terminal en la raíz del proyecto (donde está este README) y ejecuta:

```
yarn
```

Solo hay que hacerlo una vez.

## 3. Arrancar el servidor de desarrollo

```
yarn dev
```

Verás algo así:

```
  VITE v7.1.3  ready in 372 ms

  ➜  Local:   http://localhost:5173/
```

Abre <http://localhost:5173/>. **Lo que aparece es la página de bienvenida de
Vite, con el contador de ejemplo: ese es tu punto de partida y tendrás que
sustituirlo por tu aplicación.**

La página se recarga sola cada vez que guardas un fichero, así que deja el
servidor corriendo mientras desarrollas. Para pararlo, `Ctrl+C`.

---

## Qué hay en el proyecto

```
index.html            página HTML que carga la aplicación
src/
  main.jsx            punto de entrada: monta <App /> en el <div id="root">
  App.jsx             demo de Vite: este es el fichero que tienes que reescribir
  config/config.js    configuración de la aplicación (ya dada, ver abajo)
  constants/users.js  datos de prueba, para desarrollar sin depender del API
  App.css             estilos del demo de Vite
  index.css           estilos globales del demo de Vite
public/               ficheros servidos tal cual
autocorector/         tests de corrección: NO los modifiques
```

Los componentes que pide el enunciado (`Header`, `Resultados`) **todavía no
existen**: crearlos es parte del trabajo.

### Datos de prueba

`src/constants/users.js` exporta una constante llamada **`mock1`** con usuarios
de ejemplo, en el mismo formato que devuelve el API:

```jsx
import { mock1 } from "./constants/users.js";
// mock1.users -> array de usuarios
```

Ábrelo para ver qué campos trae cada usuario.

### Configuración

En `src/config/config.js`:

| Opción | Para qué sirve |
|---|---|
| `server_url` | Dirección del API. `https://dummyjson.com/users` |
| `num_items` | Cuántos usuarios pedir al traerlos todos |
| `use_server` | `true` llama al API real; `false` trabaja con `mock1` |
| `loading_timeout_ms` | Retardo, en milisegundos, para simular la espera del API |

La forma recomendada de trabajar es empezar con `use_server: false`, montar la
interfaz con los datos de prueba, y cuando todo se vea bien pasar a `true` e
implementar la llamada real.

## Comandos disponibles

| Comando | Qué hace |
|---|---|
| `yarn dev` | Arranca el servidor de desarrollo en el puerto 5173. |
| `yarn build` | Genera la versión de producción en `dist/`. |
| `yarn preview` | Sirve lo que hay en `dist/`. |
| `yarn lint` | Revisa el código en busca de errores comunes. |

---

## Corregir y entregar

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

Recuerda que hay que **añadir las capturas de pantalla** que pide el enunciado
antes de entregar.

Tus datos quedan guardados en `user.json`. Ese fichero **contiene tu token
personal: no lo subas a git ni se lo pases a nadie** (ya está en `.gitignore`).

## Problemas frecuentes

**Al ejecutar el autocorrector por primera vez falla todo con un error raro.**
Sobre el proyecto recién clonado verás `Cannot find module '/vite.svg'`, que
viene del demo de Vite que todavía está en `App.jsx`. Cuando lo reescribas
aparecerán errores del tipo `Cannot find module '../../src/Header'`, porque los
tests buscan componentes que aún no has creado. Es normal: los errores van
desapareciendo según avanzas con lo que pide el enunciado.

**El puerto 5173 está ocupado.** Vite elegirá otro automáticamente; mira la URL
que imprime el terminal, o arranca con `yarn dev --port 3000`.

**Errores raros al instalar o arrancar.** Comprueba tu versión de Node con
`node -v`. Si sigue fallando, borra `node_modules/` y vuelve a ejecutar `yarn`.

**No llegan datos del API.** Puede estar caído o sin conexión. Pon
`use_server: false` en `src/config/config.js` para seguir trabajando con los
datos de prueba.
