const form = document.querySelector('#form');
const nombre = document.querySelector('#name');
const apellido = document.querySelector('#apellido');
const email = document.querySelector('#email');
const telefono = document.querySelector('#tel');
const mensaje = document.querySelector('#mensaje');
const contador = document.querySelector('#contador');

const modalContacto = document.getElementById('modal-contacto');
const closeButtons = document.querySelectorAll('.modal__close');

// esto actualiza el contador de caracxteres en tiempo real
mensaje.addEventListener('input', () => {
  const cantidad = mensaje.value.length;
  contador.textContent = `${cantidad} / 1000 caracteres`;
});

// Validaciones al enviar el formulario
form.addEventListener('submit', e => {
  e.preventDefault(); 

  let hayError = false;
  document.querySelectorAll('.error').forEach(el => el.textContent = "");

  // Validacion nombre
  if (nombre.value.trim() === "") {
    document.querySelector('.js-error-nombre').textContent = "El nombre es obligatorio.";
    hayError = true;
  }

  // Validacion apellido
  if (apellido.value.trim() === "") {
    document.querySelector('.js-error-apellido').textContent = "El apellido es obligatorio.";
    hayError = true;
  }

  // Validacion email
  if (email.value.trim() === "") {
    document.querySelector('.js-error-email').textContent = "El email es obligatorio.";
    hayError = true;
  } else {
    const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!reEmail.test(email.value.trim())) {
      document.querySelector('.js-error-email').textContent = "El email tiene un formato inválido.";
      hayError = true;
    }
  }

  // Validacion de telefono
  const valorTel = telefono.value.trim();
  if (valorTel !== "") {
    const regexTel = /^\d{4}-\d{4}$/;
    if (!regexTel.test(valorTel)) {
      document.querySelector('.js-error-tel').textContent =
        "Formato incorrecto. Usa 1234-5678 (guion obligatorio).";
      hayError = true;
    }
  }

  // Validacion de mensaje
  if (mensaje.value.trim() === "") {
    document.querySelector('.js-error-mensaje').textContent = "El mensaje es obligatorio.";
    hayError = true;
  } else if (mensaje.value.length > 1000) {
    document.querySelector('.js-error-mensaje').textContent = "El mensaje no puede superar los 1000 caracteres.";
    hayError = true;
  }

  // muestra el modal si no hay errores
  if (!hayError) {
    modalContacto.classList.add('modal--show');
    form.reset(); // Limpia el formulario
    contador.textContent = "0 / 1000 caracteres";
  }
});

closeButtons.forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault(); 
    modalContacto.classList.remove('modal--show');
    
    
    setTimeout(() => {
      window.location.href = "./home.html";
    }, 300); 
  });
});