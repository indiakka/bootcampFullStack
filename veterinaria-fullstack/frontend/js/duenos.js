const nombre = document.getElementById("nombre");
const dni = document.getElementById("dni");
const apellido = document.getElementById("apellido");
const pais = document.getElementById("pais");
const indice = document.getElementById("indice");
const form = document.getElementById("form");
const btnGuardar = document.getElementById("btn-guardar");
const listaDuenos = document.getElementById("lista-duenos");

let duenos = [
  {
    nombre: "Naryie",
    apellido: "Vasquez",
    pais: "Colombia",
    dni: "1234567890j",
  },
  {
    nombre: "Juan David",
    apellido: "Marín",
    pais: "Colombia",
    dni: "1234567899k",
  },
];

function listarDuenos() {
  const htmlDuenos = duenos
    .map(
      (dueno, index) => `<tr>
      <th scope="row">${index}</th>
      <td>${dueno.dni}</td>
      <td>${dueno.pais}</td>
      <td>${dueno.nombre}</td>
      <td>${dueno.apellido}</td>
      <td>
          <div class="btn-group" role="group" aria-label="Basic example">
              <button type="button" class="btn btn-info editar"><i class="fas fa-edit"></i></button>
              <button type="button" class="btn btn-danger eliminar"><i class="far fa-trash-alt"></i></button>
          </div>
      </td>
    </tr>`
    )
    .join("");
  listaDuenos.innerHTML = htmlDuenos;
  Array.from(document.getElementsByClassName("editar")).forEach(
    (botonEditar, index) => (botonEditar.onclick = editar(index))
  );
  Array.from(document.getElementsByClassName("eliminar")).forEach(
    (botonEliminar, index) => (botonEliminar.onclick = eliminar(index))
  );
}

function enviarDatos(evento) {
  evento.preventDefault();
  const datos = {
    nombre: nombre.value,
    apellido: apellido.value,
    pais: pais.value,
    dni: dni.value,
  };
  const accion = btnGuardar.innerHTML;
  switch (accion) {
    case "Editar":
      duenos[indice.value] = datos;
      break;
    default:
      duenos.push(datos);
      break;
  }
  listarDuenos();
  resetModal();
}

function editar(index) {
  return function cuandoCliqueo() {
    btnGuardar.innerHTML = "Guardar";
    $("#exampleModalCenter").modal("toggle");
    const dueno = duenos[index];
    indice.value = index;
    nombre.value = dueno.nombre;
    apellido.value = dueno.apellido;
    pais.value = dueno.pais;
    dni.value = dueno.dni;
  };
}

function resetModal() {
  indice.value = "";
  nombre.value = "";
  apellido.value = "";
  pais.value = "";
  dni.value = "";
  btnGuardar.innerHTML = "Crear";
}

function eliminar(index) {
  return function clickEnEliminar() {
    duenos = duenos.filter((dueno, indiceDueno) => indiceDueno !== index);
    listarDuenos();
  };
}

listarDuenos();

form.onsubmit = enviarDatos;
btnGuardar.onclick = enviarDatos;
