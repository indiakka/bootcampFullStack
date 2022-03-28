const listaConsultas = document.getElementById("lista-consultas");
const mascota = document.getElementById("mascota");
const veterinaria = document.getElementById("veterinaria");
const form = document.getElementById("form");
const btnGuardar = document.getElementById("btn-guardar");
const indice = document.getElementById("indice");
const historia = document.getElementById("historia");
const diagnostico = document.getElementById("diagnostico");
const url = "https://veterinaria-backend-ebon.vercel.app/consultas";

let consultas = [];
let mascotas = [];
let veterinarias = [];

async function listarConsultas() {
  const entidad = "consultas";
  try {
    const respuesta = fetch(url);
    const consultasDelServidor = await respuesta.json();
    if (Array.isArray(consultasDelServidor)) {
      consultas = consultasDelServidor;
    }
    if (respuesta.ok) {
      const htmlConsultas = consultas
        .map(
          (consulta, indice) =>
            `<tr>
            <th scope="row">${indice}</th>
            <td>${consulta.mascota.nombre}</td>
            <td>${consulta.veterinaria.nombre} ${consulta.veterinaria.apellido}</td>
            <td>${consulta.fechaCreacion}</td>
            <td>${consulta.fechaEdicion}</td>
            <td>${consulta.historia}</td>
            <td>${consulta.diagnostico}</td>
            <td>
              <div class="btn-group" role="group" aria-label="Basic example">
                <button type="button" class="btn btn-info editar"><i class="fas fa-edit"></i></button> 
              </div>
            </td>
          </tr>`
        )
        .join("");
      listaConsultas.innerHTML = htmlConsultas;
      Array.from(document.getElementsByClassName("editar")).forEach(
        (botonEditar, index) => (botonEditar.onclick = editar(index))
      );
    }
  } catch (error) {
    console.log({ error });
    $(".alert-danger").show();
  }
}

async function listarMascotas() {
  const entidad = "mascotas";
  try {
    const respuesta = fetch(url);
    const mascotasDelServidor = await respuesta.json();
    if (Array.isArray(mascotasDelServidor)) {
      mascotas = mascotasDelServidor;
    }
    if (respuesta.ok) {
      const htmlMascotas = mascotas.forEach((_mascota, indice) => {
        const optionActual = document.createElement("option");
        optionActual.innerHTML = _mascota.nombre;
        optionActual.value = indice;
        mascota.appendChild(optionActual); // appendChild añade un nodo como el último hijo de un nodo
      });
    }
  } catch (error) {
    console.log({ error });
    $(".alert-danger").show();
  }
}

listarMascotas();

async function listarVeterinarias() {
  const entidad = "veterinarias";
  try {
    const respuesta = fetch(url);
    const veterinariasDelServidor = await respuesta.json();
    if (Array.isArray(veterinariasDelServidor)) {
      veterinarias = veterinariasDelServidor;
    }
    if (respuesta.ok) {
      const htmlVeterinarias = veterinaria.forEach((_veterinaria, indice) => {
        const optionActual = document.createElement("option");
        optionActual.innerHTML = `${_veterinaria.nombre} ${_veterinaria.apellido}`;
        optionActual.value = indice;
        veterinaria.appendChild(optionActual); // appendChild añade un nodo como el último hijo de un nodo
      });
    }
  } catch (error) {
    console.log({ error });
    $(".alert-danger").show();
  }
}

listarVeterinarias();

async function enviarDatos(evento) {
  evento.preventDefault();
  try {
    const datos = {
      mascota: mascota.value,
      veterinaria: veterinaria.value,
      fechaCreacion: fechaCreacion.value,
      fechaEdicion: fechaEdicion.value,
      historia: historia.value,
      diagnostico: diagnostico.value,
    };
    if (validar(datos) === true) {
      const accion = btnGuardar.innerHTML;
      let urlEnvio = url;
      let method = "POST";
      if (accion === "Editar") {
        urlEnvio += `/${indice.value}`; //concatena urlenvio + indice.value
        method = "PUT";
      }
      const respuesta = await fetch(urlEnvio, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
        mode: "cors",
      });
      if (respuesta.ok) {
        listarConsultas();
        resetModal();
      }
      formulario.classList.add("was-validated");
      return;
    }
    $(".alert-warning").show();
  } catch (error) {
    console.log({ error });
    $(".alert-danger").show();
  }
}

function editar(index) {
  return function cuandoCliqueo() {
    btnGuardar.innerHTML = "Guardar";
    $("#exampleModalCenter").modal("toggle");
    const consulta = consultas[index];
    indice.value = index;
    mascota.value = consulta.mascota.id;
    veterinaria.value = consulta.veterinaria.id;
    historia.value = consulta.historia;
    diagnostico.value = consulta.diagnostico;
  };
}

function resetModal() {
  btnGuardar.innerHTML = "Crear";
  [indice, mascota, veterinaria, historia, diagnostico].forEach(
    (inputActual) => {
      inputActual.value = "";
      inputActual.classList.remove("is-invalid");
      inputActual.classList.remove("is-valid");
    }
  );
  $(".alert-warning").hide();
  $("#exampleModalCenter").modal("toggle");
}
/* modal('toggle) cambia el estado de la modal 
si está oculta la pone visible, y al revés */

function validar(datos) {
  if (typeof datos !== "object") return false;
  let respuesta = true;
  for (let llave in datos) {
    if (datos[llave].length === 0) {
      document.getElementById(llave).classList.add("is-invalid");
      respuesta = false;
    } else {
      document.getElementById(llave).classList.remove("is-invalid");
      document.getElementById(llave).classList.add("is-valid");
    }
  }
  if (respuesta === true) $(".alert-warning").hide();
  return respuesta;
}

btnGuardar.onclick = enviarDatos;

listarMascotas();
listarConsultas();
listarVeterinarias();
