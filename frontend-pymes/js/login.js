document.getElementById("formLogin").addEventListener("submit", e => {
  e.preventDefault();
  const datos = {
    correo: document.getElementById("correo").value,
    contraseña: document.getElementById("contraseña").value
  };

  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  })
  .then(res => res.json())
  .then(data => {
    if (data.message === "Login exitoso") {
      // Guardar usuario en localStorage
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      // Redirigir al dashboard
      window.location.href = "dashboard.html";
    } else {
      alert("Credenciales incorrectas");
    }
  });
});
