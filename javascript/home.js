document.addEventListener("DOMContentLoaded", () => {
  console.log("home.js cargado");

  // --- 🧮 CONTADOR ---
  const contadorSpan = document.querySelector(".contador");
  let contadorCursos = parseInt(sessionStorage.getItem("contadorCursos")) || 0;
  contadorSpan.textContent = contadorCursos;

  function actualizarContador(nuevoValor) {
    contadorCursos = nuevoValor;
    contadorSpan.textContent = contadorCursos;
    sessionStorage.setItem("contadorCursos", contadorCursos);
  }

  window.addEventListener("cursoInscripto", () => {
    actualizarContador(contadorCursos + 1);
  });

  // --- 🖼️ SLIDER ---
  const imagenes = document.querySelectorAll(".slider img");
  const btnIzquierda = document.querySelector(".flecha.izquierda");
  const btnDerecha = document.querySelector(".flecha.derecha");
  const contenedorSlider = document.querySelector(".slider");
  let indiceActual = 0;
  let intervalo;

  // Crear puntos indicadores
  const contenedorIndicadores = document.createElement("div");
  contenedorIndicadores.classList.add("puntos");
  const indicadores = [];

  imagenes.forEach((_, i) => {
    const punto = document.createElement("div");
    punto.classList.add("punto");
    if (i === 0) punto.classList.add("activo");
    punto.addEventListener("click", () => {
      indiceActual = i;
      mostrarImagen(indiceActual);
      reiniciarAutoSlide();
    });
    contenedorIndicadores.appendChild(punto);
    indicadores.push(punto);
  });

  contenedorSlider.appendChild(contenedorIndicadores);

  function mostrarImagen(index) {
    imagenes.forEach((img, i) => {
      img.classList.toggle("activa", i === index);
      indicadores[i].classList.toggle("activo", i === index);
    });
  }

  function iniciarAutoSlide() {
    intervalo = setInterval(() => {
      indiceActual = (indiceActual + 1) % imagenes.length;
      mostrarImagen(indiceActual);
    }, 2000);
  }

  function reiniciarAutoSlide() {
    clearInterval(intervalo);
    iniciarAutoSlide();
  }

  btnIzquierda.addEventListener("click", () => {
    indiceActual = (indiceActual - 1 + imagenes.length) % imagenes.length;
    mostrarImagen(indiceActual);
    reiniciarAutoSlide();
  });

  btnDerecha.addEventListener("click", () => {
    indiceActual = (indiceActual + 1) % imagenes.length;
    mostrarImagen(indiceActual);
    reiniciarAutoSlide();
  });

  // Mostrar la primera imagen y arrancar
  mostrarImagen(indiceActual);
  iniciarAutoSlide();
});
