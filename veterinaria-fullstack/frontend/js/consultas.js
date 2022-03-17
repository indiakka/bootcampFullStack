const listaConsultas = document.getElementById("lista-consultas");
const mascota = document.getElementById( "mascota" );
const veterinaria = document.getElementById("veterinaria");
const url = "http://localhost:5000";

let consultas = [];
let mascotas = [];
let veterinarias =[]

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
                <button type="button" class="btn btn-info">
                  Editar
                </button>
              </div>
            </td>
          </tr>`
        )
        .join("");
      listaConsultas.innerHTML = htmlConsultas;
      Array.from(document.getElementsByClassName("editar")).forEach(
        (botonEditar, index) => (botonEditar.onclick = editar(index))
      );
      Array.from(document.getElementsByClassName("eliminar")).forEach(
        (botonEliminar, index) => (botonEliminar.onclick = eliminar(index))
      );
      return;
    }
    listaDuenos.innerHTML = `<tr>
        <td colspan="5" class="lista-vacia">No hay duen@s</td>
      </tr>`;
  } catch (error) {
    throw error;
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
    throw error;
  }
}

listarMascotas()

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
    throw error;
  }
}

listarVeterinarias() 


async function enviarDatos(evento) {
  evento.preventDefault();
  try {
    const datos = {
      mascota: mascota.value,
      veterinaria: veterinaria.value,
      fechaCreacion: fechaCreacion.value,
      fechaEdicion: fechaEdicion.value,
      historia: historia.value,
      diagnostico: diagnositco.value,
    };
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
  } catch (error) {
    console.log({ error });
    $(".alert").show();
  }
}

function editar(index) {
  return function cuandoCliqueo() {
    btnGuardar.innerHTML = "Guardar";
    $("#exampleModalCenter").modal("toggle");
    const consulta = consultas[index];
    indice.value = index;
    mascota.value = consulta.mascota;
    veterinaria.value = consulta.veterinaria;
    fechaCreacion.value = consulta.fechaCreacion;
    fechaEdicion.value = consulta.fechaEdicion;
    historia.value = consulta.historia;
    diagnostico.value = consulta.diagnositco;
  };
}

function resetModal() {
  indice.value = "";
  (mascota.value = ""),
    (veterinaria.value = ""),
    (fechaCreacion.value = ""),
    (fechaEdicion.value = ""),
    (historia.value = ""),
    (diagnositco.value = ""),
    (btnGuardar.innerHTML = "Crear");
}

function eliminar(index) {
  const urlEnvio = `${url}/${index}`;
  return async function clickEnEliminar() {
    try {
      const respuesta = await fetch(urlEnvio, {
        method: "DELETE",
        mode: "cors",
      });
      if (respuesta.ok) {
        listarConsultas();
      }
    } catch (error) {
      console.log({ error });
      $(".alert").show();
    }
  };
}

form.onsubmit = enviarDatos;
btnGuardar.onclick = enviarDatos;
