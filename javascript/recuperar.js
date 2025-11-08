document.addEventListener("DOMContentLoaded", function () {
  const emailInput = document.getElementById("email");
  const userInput = document.getElementById("nombre-usuario");
  const btnEnviar = document.getElementById("btn-enviar");
  const btnCancelar = document.getElementById("btn-cancelar");
  const mensaje = document.getElementById("mensaje");

  function actualizarBoton() {
    btnEnviar.disabled = !(emailInput.value.trim() && userInput.value.trim());
  }

  emailInput.addEventListener("input", actualizarBoton);
  userInput.addEventListener("input", actualizarBoton);

  btnEnviar.addEventListener("click", function (e) {
    e.preventDefault();
    const email = emailInput.value.trim();
    const usuario = userInput.value.trim();

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const existe = usuarios.find(
      (u) => u.email === email && u.usuario === usuario
    );

    if (existe) {
      mensaje.textContent = "Se ha enviado un correo de recuperación";
      mensaje.style.color = "green";
      setTimeout(() => {
        window.location.href = "../index.html"; // volver al login
      }, 3000);
    } else {
      mensaje.textContent = "Usuario o email incorrecto.";
      mensaje.style.color = "red";
    }
  });

  btnCancelar.addEventListener("click", function () {
    window.location.href = "../index.html";
  });

  btnEnviar.disabled = true;
});
