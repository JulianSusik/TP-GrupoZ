import { todosLosCursos } from '../javascript/cursos.js';

document.addEventListener("DOMContentLoaded", () => {
  console.log("todos-los-cursos.js cargado");

  // --- 1. SELECTORES DEL DOM ---

  // Cursos
  const todosContainer = document.getElementById('todos-container');

  // Búsqueda
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');

  // --- 2. DATOS Y LISTAS ---

  // --- 3. FUNCIONES ---

  // Función de Renderizado de Cursos
  function renderizarCursos(cursos, contenedor) {
    contenedor.innerHTML = ''; // Limpiar el contenedor

    // Mensaje si no hay resultados
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

  // --- 4. EVENT LISTENERS ---

  // Listeners de Búsqueda
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita que la página se recargue
  });

  searchInput.addEventListener('input', () => {
    // Obtener el texto, convertir a minúsculas y quitar espacios
    const terminoBusqueda = searchInput.value.toLowerCase().trim();

    // Filtrar todos los cursos basándose en el texto
    const cursosFiltrados = todosLosCursos.filter(curso =>
      curso.titulo.toLowerCase().includes(terminoBusqueda)
    );

    // Volver a dibujar con los cursos filtrados
    renderizarCursos(cursosFiltrados, todosContainer);
  });

  // --- 5. EJECUCIÓN INICIAL ---

  // Renderizado inicial de TODOS los cursos
  renderizarCursos(todosLosCursos, todosContainer);
});
