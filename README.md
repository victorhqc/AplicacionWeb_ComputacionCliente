# AplicacionWeb_ComputacionCliente

Tarea de "Computación en el Cliente"

# Introducción

Este proyecto tiene como única finalidad ejemplificar los usos de HTML, CSS y JavaScript. La
estructura del código, y la forma de servir los archivos al cliente, no son como la industria hoy
en día trabaja. En la industria por lo general se toman en cuenta dos tipos de aplicaciones, que
incluso pueden combinarse:

1. **SPA:** Por sus siglas en inglés "Single Page Application", son las aplicaciones web más
populares. Se tratan de aplicaciones que no necesitan recargar toda la página cuando existe una
interacción con el usuario, como obtener nuevos datos o navegar por la aplicación.
2. **Server Side Rendering:** Quizá una de las formas más famosos de hacer las páginas en la década
anterior, antes de las "SPA", casi todos los sitios se hacían con PHP o con una tecnología similar.
Hoy en día la industria está retomando este tipo de aplicaciones para algunas cosas, y las mezcla
con una implementación de SPA.

Como dato adicional, la industria hoy en día realiza todo tipo de optimizaciones a los archivos
que se sirven desde Internet, para reducir el consumo de datos utilizados al descargar un sitio
web en el navegador. Cosas como: Minificación de código, compresión de imágenes, etc. En éste
proyecto ninguno de estas estrategias se utiliza, principalmente para mantenerlo lo más simple
posible y enfocarse en los temas estudiados.

# Desarrollo

## Requisitos

- Node >= 12

## Modo de desarrollo

Ingresa a [https://unsplash.com/developers](https://unsplash.com/developers) y obtén llaves de
desarrollador, y crea un archivo `.env` con los valores de las llaves

```
UNSPLASH_ACCESS_KEY=KEY
UNSPLASH_SECRET_KEY=KEY
```

Ejecuta lo siguiente para servir los archivos estáticos

```sh
npm run build:pictures
npm start
```

# Características del sitio

## Menú interactivo

## Galería de imágenes dinámica

La galería muestra imágenes, las cuales son obtenidas dinámicamente al realizar el comando de
`npm run build:pictures`. Esto podría hacerse de muchas otras formas, pero la forma más sencilla
es:

1. Obtener las imágenes primero.
2. Servirlas como archivos estáticos.

Lo malo de esto es que el comando se debe de ejecutar siempre que queramos mostrar nuevas imágenes
de forma dinámica. Y sólo un administrador de sitio podrá hacerlo, pero es suficiente, ya que en
esta tarea sólo nos interesa centrarnos en Javascript del lado del cliente.

## Animaciones y transiciones de CSS
