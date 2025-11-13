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
    // Muestra nombre y apellido si existen, si no, el usuario
    const nombreCompleto = (usuarioSesion.nombre && usuarioSesion.apellido)
      ? `${usuarioSesion.nombre} ${usuarioSesion.apellido}`
      : usuarioSesion.usuario;
    nombreUsuario.textContent = nombreCompleto || "Usuario";
  }

  // Mostrar datos en los inputs
  document.getElementById("nombre").value = usuarioSesion.nombre || "";
  document.getElementById("apellido").value = usuarioSesion.apellido || "";
  document.getElementById("usuario").value = usuarioSesion.usuario || "";
  document.getElementById("email").value = usuarioSesion.email || "";

  document.getElementById("contrasenia").value =
    usuarioSesion.contrasenia || "";

  // Cargar datos de tarjeta desde la sesión o desde la lista de usuarios si no están en la sesión
  let numeroTarjeta = usuarioSesion.numeroTarjeta || "";
  let codTarjeta = usuarioSesion.codTarjeta || "";

  if (!numeroTarjeta || !codTarjeta) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioGuardado = usuarios.find(u => u.usuario === usuarioSesion.usuario);
    if (usuarioGuardado) {
      numeroTarjeta = usuarioGuardado.numeroTarjeta || "";
      codTarjeta = usuarioGuardado.codTarjeta || "";
      // Actualizar la sesión con los datos cargados
      usuarioSesion.numeroTarjeta = numeroTarjeta;
      usuarioSesion.codTarjeta = codTarjeta;
      localStorage.setItem("usuarioSesionIniciada", JSON.stringify(usuarioSesion));
    }
  }

  document.getElementById("numeroTarjeta").value = numeroTarjeta;
  // NUEVO: Asignar valor al campo del código de seguridad
  const codTarjetaInput = document.getElementById("codTarjeta");
  if (codTarjetaInput) codTarjetaInput.value = codTarjeta;

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

    const nuevoNombre = document.getElementById("nombre").value.trim();
    const nuevoApellido = document.getElementById("apellido").value.trim();
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
    usuarioSesion.nombre = nuevoNombre;
    usuarioSesion.apellido = nuevoApellido;
    usuarioSesion.email = nuevoEmail;
    if (nuevaPass) usuarioSesion.contrasenia = nuevaPass;
    usuarioSesion.numeroTarjeta = document.getElementById("numeroTarjeta").value.trim();
    const nuevoCodTarjeta = document.getElementById("codTarjeta").value.trim();

    // Validar que el código de seguridad tenga 3 o 4 dígitos si se proporciona
    const reCvv = /^\d{3,4}$/;
    if (nuevoCodTarjeta && !reCvv.test(nuevoCodTarjeta)) {
      alert("El código de seguridad debe tener 3 o 4 dígitos numéricos.");
      return; // Detener el proceso de guardado
    }
    usuarioSesion.codTarjeta = nuevoCodTarjeta;

    // Actualizar también en la lista de usuarios
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioIndex = usuarios.findIndex(u => u.usuario === usuarioSesion.usuario);
    if (usuarioIndex !== -1) {
      usuarios[usuarioIndex] = { ...usuarios[usuarioIndex], ...usuarioSesion };
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }

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

  // --- NUEVO: Cargar y mostrar historial de compras ---
  const historialContainer = document.getElementById("historial-container");
  if (historialContainer && usuarioSesion) {
    const historialKey = `historial_${usuarioSesion.usuario}`;
    const historial = JSON.parse(localStorage.getItem(historialKey)) || [];

    if (historial.length === 0) {
      historialContainer.innerHTML = "<p>Aún no has realizado ninguna compra.</p>";
    } else {
      let historialHtml = "";
      // Mostramos las compras de la más reciente a la más antigua
      historial.slice().reverse().forEach((compra, index) => {
        historialHtml += `
          <div class="compra-record">
            <div class="compra-header">
              <h4>Compra realizada el ${compra.fecha}</h4>
              <span>Total: $${compra.total}</span>
            </div>
            <ul class="compra-items">
        `;

        compra.items.forEach(item => {
          historialHtml += `<li>${item.cantidad}x ${item.nombre}</li>`;
        });

        historialHtml += `
            </ul>
          </div>
        `;
      });
      historialContainer.innerHTML = historialHtml;
    }
  }
});
