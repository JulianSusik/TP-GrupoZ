// ../javascript/detalle.js

// 1. Importar los datos desde cursos.js
import { todosLosCursos } from './cursos.js';

// 2. Obtener el ID de la URL
const urlParams = new URLSearchParams(window.location.search);
const cursoId = urlParams.get('id');

// 3. Encontrar el curso que coincida con el ID
const curso = todosLosCursos.find(c => c.id == cursoId);

// 4. Obtener los contenedores del HTML
const infoContainer = document.getElementById('detalle-info-container');
const contenidosContainer = document.getElementById('detalle-contenidos-container');
const docenteContainer = document.getElementById('detalle-docente-container');

// 5. Verificar si el curso se encontró
if (curso) {
  // 5.1 Renderizar la Información Principal
  
  // Cambiamos el título de la pestaña del navegador
  document.title = `${curso.titulo}`; // Título dinámico
  
  infoContainer.innerHTML = `
    <div class="foto-curso-detalle"> 
      <img src="${curso.imagen}" alt="Imagen de ${curso.titulo}">
    </div>
    <div>
      <h1 class="titulo-curso">${curso.titulo}</h1>
      <p><strong>Valor:</strong> $${curso.precio}</p>
      <p><strong>Tiempo de dedicación necesario:</strong> ${curso.duracion_semanas} semanas</p>
      <p><strong>Descripción del curso:</strong> ${curso.descripcion}</p>
      <p><strong>Requisitos previos:</strong> ${curso.requisitos}</p>
      
      <a href="../html/Formulario.html" class="btn-inscribirse">INSCRIBIRSE</a>
    </div>
  `;

  // 5.2 Renderizar los Contenidos (Unidades y Temas)
  let contenidosHTML = ''; 
  
  curso.contenidos.forEach((unidad, index) => {
    // El primer <details> (index 0) estará 'open'
    contenidosHTML += `<details ${index === 0 ? 'open' : ''}>`;
    contenidosHTML += `<summary>${unidad.unidad}</summary>`;
    contenidosHTML += `<ul>`;
    
    unidad.temas.forEach(tema => {
      contenidosHTML += `<li>${tema}</li>`;
    });
    
    contenidosHTML += `</ul>`;
    contenidosHTML += `</details>`;
  });
  
  contenidosContainer.innerHTML = contenidosHTML; 

  
  // 5.3 Renderizar la sección del Docente
  const estrellas = '⭐'.repeat(curso.docente.rating);

  docenteContainer.innerHTML = `
    <h1 class="nombre-docente">Docente</h1>
    <div class="perfil-docente">
      <div class="foto-docente"></div> 
      <div>
        <h3>${curso.docente.nombre}</h3>
        <p>${estrellas}</p>
        <p>${curso.docente.bio}</p>
      </div>
    </div>
  `;

} else {
  // 6. Si el ID no existe, mostrar un error
  infoContainer.innerHTML = `
    <div style="text-align: center; padding: 40px;">
      <h1>Error 404</h1>
      <p>El curso que estás buscando no existe.</p>
      <a href="../html/home.html" class="btn-inscribirse">Volver al inicio</a>
    </div>
  `;
  // Ocultamos las otras secciones
  contenidosContainer.style.display = 'none';
  docenteContainer.style.display = 'none';
  document.querySelector('.titulo-contenido').style.display = 'none';
}


// -------------------------------------------------------------
// 7. RENDERIZAR LA SECCIÓN "CURSOS DESTACADOS"
// -------------------------------------------------------------
// Esto renderiza la sección de "Cursos destacados" al final
// de la página, asegurándose de que los links sean dinámicos.

const destacadosContainer = document.getElementById('detalle-destacados-container');
const cursosDestacados = todosLosCursos.filter(c => c.categoria === 'destacado');

let destacadosHTML = '';
cursosDestacados.forEach(curso => {
  destacadosHTML += `
    <article>
      <h3>${curso.titulo}</h3>
      <p>Duración: ${curso.duracion_semanas} semanas</p>
      <p>Precio: $${curso.precio}</p>
      
      <a href="../cursos/detalle-curso.html?id=${curso.id}">
        <button>Ver detalle</button>
      </a>
    </article>
  `;
});

destacadosContainer.innerHTML = destacadosHTML;