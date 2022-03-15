const url = require("url");
const enrutador = require("./enrutador");
const StringDecoder = require("string_decoder").StringDecoder;

module.exports = (req, res) => {
  // 1- obtener url desde el objeto request
  const urlActual = req.url;
  const urlParseada = url.parse(urlActual, true);

  // 2- obtener la ruta
  const ruta = urlParseada.pathname;

  // 3- quitar slash(/)
  const rutaLimpia = ruta.replace(/^\/+|\/+$/g, "");

  // 3.1-obtener el método
  const metodo = req.method.toLowerCase();

  // 3.2- obtener varaibles del query url
  const { query = {} } = urlParseada;

  // 3.3-obtener headers
  const { headers = {} } = req;

  // 3.4 obtener payload, en el caso de haber uno (payload: son paquetes o fragmentos de datos enviados al servidor y a los que normalmente no se puede acceder. Se puede acceder a ellos cuando los decodificamos)
  const decoder = new StringDecoder("utf-8");
  let buffer = ""; //Los búferes almacenan una secuencia de enteros, de forma similar a una matriz en JavaScript.

  // 3.4.1 ir acumulando la data cuando el request reciba un payload
  req.on("data", (data) => {
    buffer += decoder.write(data);
    // va a codificar cualquier pedazo de la data y la convierte en string
  });

  // 3.4.2 terminar de acumular datos y decirle al decoder que finalice
  req.on("end", () => {
    buffer += decoder.end();

    if (headers["content-type"] === "application/json") {
      buffer = JSON.parse(buffer);
    }

    // 3.4.3- revisar si tiene subrutas, en este caso es el indice del array
    if (rutaLimpia.indexOf("/") > -1) {
      // indexOf = contiene
      //separar las rutas
      var [rutaPrincipal, indice] = rutaLimpia.split("/");
    }

    // 3.5 ordenar la data del request
    const data = {
      indice,
      ruta: rutaPrincipal || rutaLimpia,
      query,
      metodo,
      headers,
      payload: buffer,
    };

    console.log({ data });

    // 3.6- elegir el manejador handler dependiendo de la ruta y asignarle funcion que el enrutador tiene
    let handler;
    if (data.ruta && enrutador[data.ruta] && enrutador[data.ruta][metodo]) {
      handler = enrutador[data.ruta][metodo];
    } else {
      handler = enrutador.noEncontrado;
    }

    console.log("handler", handler);

    // 4- ejecutar handler para enviar respuesta
    if (typeof handler === "function") {
      handler(data, (statusCode = 200, mensaje) => {
        const respuesta = JSON.stringify(mensaje);
        res.setHeader("Content-Type", "aplication/json");
        res.writeHead(statusCode);
        // Linea donde realmente ya estamos respondiendo a la aplicación cliente
        res.end(respuesta);
      });
    }
  });
};
