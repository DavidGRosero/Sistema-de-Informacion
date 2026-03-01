function agregarCliente() {
  const nombre = document.getElementById('nombre').value;
  const contacto = document.getElementById('contacto').value;
  const direccion = document.getElementById('direccion').value;

  if(nombre && contacto && direccion) {
    const tabla = document.getElementById('tablaClientes');
    const fila = tabla.insertRow();
    fila.insertCell(0).innerText = nombre;
    fila.insertCell(1).innerText = contacto;
    fila.insertCell(2).innerText = direccion;

    document.getElementById('formCliente').reset();
  } else {
    alert("Complete todos los campos");
  }
}
