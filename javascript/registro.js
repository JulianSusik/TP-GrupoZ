document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const confirmarBtn = document.querySelector("button[type='submit']");
  const cancelarBtn = document.querySelector(".cancelar");

  const nombreInput = document.getElementById("nombre");
  const apellidoInput = document.getElementById("apellido");
  const emailInput = document.getElementById("email");
  const usuarioInput = document.getElementById("nombre-usuario");
  const contraseniaInput = document.getElementById("contrasenia");
  const repetirInput = document.getElementById("repetir-contrasenia");
  const tarjetaInput = document.getElementById("numeroTarjeta");
  const codigoInput = document.getElementById("codigoSeguridad");

  const metodoTarjeta = document.getElementById("tarjeta");
  const metodoCupon = document.getElementById("cupon");
  const metodoTransferencia = document.getElementById("transferencia");

  const pagoFacil = document.getElementById("pago-facil");
  const rapipago = document.getElementById("rapipago");

  // Crear mensajes de error dinámicos
  const crearMensajeError = (input) => {
    const msg = document.createElement("span");
    msg.style.color = "red";
    msg.style.fontSize = "0.8rem";
    msg.classList.add("error-msg");
    input.insertAdjacentElement("afterend", msg);
    return msg;
  };

  const errores = {
    nombre: crearMensajeError(nombreInput),
    apellido: crearMensajeError(apellidoInput),
    email: crearMensajeError(emailInput),
    usuario: crearMensajeError(usuarioInput),
    contrasenia: crearMensajeError(contraseniaInput),
    repetir: crearMensajeError(repetirInput),
    tarjeta: crearMensajeError(tarjetaInput),
    codigo: crearMensajeError(codigoInput),
  };

  let errorCupon = document.createElement("span");
  errorCupon.style.color = "red";
  errorCupon.style.fontSize = "0.8rem";
  errorCupon.classList.add("error-msg");
  metodoCupon.parentElement.insertAdjacentElement("afterend", errorCupon);

  // --- Validaciones ---
  const validarNombreApellido = (valor) =>
    /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/.test(valor.trim());
  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validarUsuario = (user) => /^[a-zA-Z0-9]+$/.test(user);
  const validarContrasenia = (pass) => {
    if (pass.length < 8) return false;
    const letras = (pass.match(/[A-Za-z]/g) || []).length;
    const numeros = (pass.match(/\d/g) || []).length;
    const simbolos = (pass.match(/[^A-Za-z0-9]/g) || []).length;
    return letras >= 2 && numeros >= 2 && simbolos >= 2;
  };
  const validarCodigo = (codigo) => /^[0-9]{3,4}$/.test(codigo);

  // 💳 Validación corregida de tarjeta (acepta espacios)
  const validarTarjeta = (num) => {
    const limpio = num.replace(/\s+/g, ""); // quita espacios
    return /^\d{16}$/.test(limpio);
  };

  // --- Validar formulario ---
  const actualizarEstado = () => {
    let esValido = true;
    errorCupon.textContent = "";

    if (!validarNombreApellido(nombreInput.value)) {
      errores.nombre.textContent = "Solo letras.";
      esValido = false;
    } else errores.nombre.textContent = "";

    if (!validarNombreApellido(apellidoInput.value)) {
      errores.apellido.textContent = "Solo letras.";
      esValido = false;
    } else errores.apellido.textContent = "";

    if (!validarEmail(emailInput.value)) {
      errores.email.textContent = "Email inválido.";
      esValido = false;
    } else errores.email.textContent = "";

    if (!validarUsuario(usuarioInput.value)) {
      errores.usuario.textContent = "Solo letras y números.";
      esValido = false;
    } else errores.usuario.textContent = "";

    if (!validarContrasenia(contraseniaInput.value)) {
      errores.contrasenia.textContent =
        "Mínimo 8 caracteres, 2 letras, 2 números y 2 símbolos.";
      esValido = false;
    } else errores.contrasenia.textContent = "";

    if (repetirInput.value !== contraseniaInput.value) {
      errores.repetir.textContent = "Las contraseñas no coinciden.";
      esValido = false;
    } else errores.repetir.textContent = "";

    if (metodoTarjeta.checked) {
      if (!validarCodigo(codigoInput.value)) {
        errores.codigo.textContent = "Debe tener 3 o 4 dígitos.";
        esValido = false;
      } else errores.codigo.textContent = "";

      if (!validarTarjeta(tarjetaInput.value)) {
        errores.tarjeta.textContent = "Número de tarjeta inválido.";
        esValido = false;
      } else errores.tarjeta.textContent = "";
    }

    if (metodoCupon.checked) {
      if (!(pagoFacil.checked ^ rapipago.checked)) {
        errorCupon.textContent = "Elegí una opción: Pago Fácil o Rapipago.";
        esValido = false;
      }
    }

    confirmarBtn.disabled = !esValido;
    confirmarBtn.style.opacity = esValido ? 1 : 0.5;
    return esValido;
  };

  // --- Eventos dinámicos ---
  pagoFacil.addEventListener("change", () => {
    if (pagoFacil.checked) rapipago.checked = false;
    actualizarEstado();
  });

  rapipago.addEventListener("change", () => {
    if (rapipago.checked) pagoFacil.checked = false;
    actualizarEstado();
  });

  const actualizarCamposMetodoPago = () => {
    tarjetaInput.disabled = true;
    codigoInput.disabled = true;
    pagoFacil.disabled = true;
    rapipago.disabled = true;

    if (metodoTarjeta.checked) {
      tarjetaInput.disabled = false;
      codigoInput.disabled = false;
    } else if (metodoCupon.checked) {
      pagoFacil.disabled = false;
      rapipago.disabled = false;
    }

    actualizarEstado();
  };

  metodoTarjeta.addEventListener("change", actualizarCamposMetodoPago);
  metodoCupon.addEventListener("change", actualizarCamposMetodoPago);
  metodoTransferencia.addEventListener("change", actualizarCamposMetodoPago);
  form.addEventListener("input", actualizarEstado);

  // --- Envío del formulario ---
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!actualizarEstado()) return;

    const metodoSeleccionado = document.querySelector(
      'input[name="metodoPago"]:checked'
    )?.value;

    const nuevoUsuario = {
      nombre: nombreInput.value.trim(),
      apellido: apellidoInput.value.trim(),
      email: emailInput.value.trim(),
      usuario: usuarioInput.value.trim(),
      contrasenia: contraseniaInput.value,
      metodoPago: metodoSeleccionado,
    };

    if (metodoSeleccionado === "tarjeta") {
      nuevoUsuario.numeroTarjeta = tarjetaInput.value;
      nuevoUsuario.codigoSeguridad = codigoInput.value;
    } else if (metodoSeleccionado === "cupon") {
      nuevoUsuario.formaPago = pagoFacil.checked ? "pago-facil" : "rapipago";
    }

    let usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];
    const yaExiste = usuariosGuardados.some(
      (u) =>
        u.usuario === nuevoUsuario.usuario || u.email === nuevoUsuario.email
    );
    if (yaExiste) {
      errores.usuario.textContent = "El usuario o email ya existen.";
      return;
    }

    usuariosGuardados.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));
    localStorage.setItem(`carrito_${nuevoUsuario.usuario}`, JSON.stringify([]));

    alert("¡Registro exitoso!");
    window.location.href = "../index.html";
  });

  cancelarBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "../index.html";
  });

  actualizarCamposMetodoPago();
});
