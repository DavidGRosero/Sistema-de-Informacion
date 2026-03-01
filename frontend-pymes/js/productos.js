function agregarProducto() {
  const nombre = document.getElementById('nombre').value;
  const precio = document.getElementById('precio').value;
  const stock = document.getElementById('stock').value;

  if(nombre && precio && stock) {
    const tabla = document.getElementById('tablaProductos');
    const fila = tabla.insertRow();
    fila.insertCell(0).innerText = nombre;
    fila.insertCell(1).innerText = precio;
    fila.insertCell(2).innerText = stock;

    document.getElementById('formProducto').reset();
  } else {
    alert("Complete todos los campos");
  }
}
