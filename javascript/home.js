import { todosLosCursos } from '../javascript/cursos.js';

document.addEventListener("DOMContentLoaded", () => {
  console.log("home.js cargado");

  // --- 1. SELECTORES DEL DOM ---
  
  // Contador
  const contadorSpan = document.querySelector(".contador");
  
  // Slider
  const imagenes = document.querySelectorAll(".slider img");
  const btnIzquierda = document.querySelector(".flecha.izquierda");
  const btnDerecha = document.querySelector(".flecha.derecha");
  const contenedorSlider = document.querySelector(".slider");
  
  // Cursos
  const destacadosContainer = document.getElementById('destacados-container');
  const otrosContainer = document.getElementById('otros-container');
  
  // Búsqueda (¡NUEVO!)
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');

  // --- 2. DATOS Y LISTAS ---
  
  let contadorCursos = parseInt(sessionStorage.getItem("contadorCursos")) || 0;
  let indiceActual = 0;
  let intervalo;
  const cursosDestacados = todosLosCursos.filter(curso => curso.categoria === 'destacado');
  const otrosCursos = todosLosCursos.filter(curso => curso.categoria === 'otro');

  // --- 3. FUNCIONES ---

  // Función del Contador
  function actualizarContador(nuevoValor) {
    contadorCursos = nuevoValor;
    contadorSpan.textContent = contadorCursos;
    sessionStorage.setItem("contadorCursos", contadorCursos);
  }

  // Función de Renderizado de Cursos (MODIFICADA)
  function renderizarCursos(cursos, contenedor) {
    contenedor.innerHTML = ''; // Limpiar el contenedor

    // (¡NUEVO!) Mensaje si no hay resultados
    if (cursos.length === 0) {
      contenedor.innerHTML = '<p class="no-resultados">No se encontraron cursos con ese nombre.</p>';
      return;
    }

    // Recorremos el array y creamos el HTML
    cursos.forEach(curso => {
      const articleHTML = `
        <article>
          <h3>${curso.titulo}</h3>
          <p>Duración: ${curso.duracion_semanas} semanas</p>
          <p>Precio: $${curso.precio}</p>
          <a href="../cursos/detalle-curso.html?id=${curso.id}">
            <button>Ver detalle</button>
          </a>
        </article>
      `;
      contenedor.innerHTML += articleHTML;
    });
  }

  // Funciones del Slider
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

  // --- 4. EVENT LISTENERS ---

  // Listener del Contador
  window.addEventListener("cursoInscripto", () => {
    actualizarContador(contadorCursos + 1);
  });

  // Listeners del Slider
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

  // Listeners de Búsqueda (¡NUEVO!)
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita que la página se recargue
  });

  searchInput.addEventListener('input', () => {
    // Obtener el texto, convertir a minúsculas y quitar espacios
    const terminoBusqueda = searchInput.value.toLowerCase().trim();

    // Filtrar las listas originales basándose en el texto
    const destacadosFiltrados = cursosDestacados.filter(curso => 
      curso.titulo.toLowerCase().includes(terminoBusqueda)
    );
    
    const otrosFiltrados = otrosCursos.filter(curso => 
      curso.titulo.toLowerCase().includes(terminoBusqueda)
    );

    // Volver a dibujar, pero solo con los cursos filtrados
    renderizarCursos(destacadosFiltrados, destacadosContainer);
    renderizarCursos(otrosFiltrados, otrosContainer);
  });

  // --- 5. EJECUCIÓN INICIAL ---

  // Iniciar Contador
  contadorSpan.textContent = contadorCursos;

  // Crear puntos indicadores del Slider
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

  // Iniciar Slider
  mostrarImagen(indiceActual);
  iniciarAutoSlide();

  // Renderizado inicial de TODOS los cursos
  renderizarCursos(cursosDestacados, destacadosContainer);
  renderizarCursos(otrosCursos, otrosContainer);
});