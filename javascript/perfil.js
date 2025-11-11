document.addEventListener("DOMContentLoaded", () => {
  // Recuperamos la sesión guardada
  const usuarioSesion = JSON.parse(
    localStorage.getItem("usuarioSesionIniciada")
  );

  if (!usuarioSesion) {
    // Si no hay sesión activa, redirige al login
    alert("Debes iniciar sesión para acceder al perfil.");
    window.location.href = "../index.html";
    return;
  }

  // Mostrar nombre en la cabecera del perfil
  const nombreUsuario = document.getElementById("nombre-usuario");
  if (nombreUsuario) {
    nombreUsuario.textContent =
      usuarioSesion.nombre || usuarioSesion.usuario || "Usuario";
  }

  // Mostrar datos en los inputs
  document.getElementById("email").value = usuarioSesion.email || "";
  document.getElementById("contrasenia").value =
    usuarioSesion.contrasenia || "";

  // ✅ Cerrar sesión correctamente
  const btnCerrar = document.querySelector(".btn-cerrar");
  btnCerrar.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("usuarioSesionIniciada");
    alert("Sesión cerrada correctamente.");
    window.location.href = "../index.html";
  });

  // ✅ Guardar cambios (si querés permitir modificar datos)
  const form = document.querySelector(".perfil-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nuevoEmail = document.getElementById("email").value.trim();
    const nuevaPass = document
      .getElementById("ingresar-contrasenia")
      .value.trim();
    const repetirPass = document
      .getElementById("repetir-contrasenia")
      .value.trim();

    if (nuevaPass && nuevaPass !== repetirPass) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    // Actualiza los datos del usuario en localStorage
    usuarioSesion.email = nuevoEmail;
    if (nuevaPass) usuarioSesion.contrasenia = nuevaPass;

    localStorage.setItem(
      "usuarioSesionIniciada",
      JSON.stringify(usuarioSesion)
    );
    alert("Datos actualizados correctamente.");
  });

  // ✅ Eliminar cuenta
  const btnEliminar = document.getElementById("btn-eliminar");
  btnEliminar.addEventListener("click", () => {
    const confirmacion = confirm(
      "¿Seguro que querés eliminar tu cuenta? Esta acción no se puede deshacer."
    );

    if (confirmacion) {
      // Obtener todos los usuarios
      let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

      // Filtrar para eliminar el usuario actual
      const usuarioActual = usuarioSesion.usuario;
      usuarios = usuarios.filter((u) => u.usuario !== usuarioActual);

      // Guardar lista actualizada
      localStorage.setItem("usuarios", JSON.stringify(usuarios));

      // Borrar sesión actual
      localStorage.removeItem("usuarioSesionIniciada");

      alert("Tu cuenta ha sido eliminada correctamente.");
      window.location.href = "../index.html";
    }
  });
});
