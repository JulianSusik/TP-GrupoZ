// ../javascript/cursos.js
// Esta es AHORA tu ÚNICA fuente de verdad.
// Contiene la información de los 8 archivos HTML.

export const todosLosCursos = [
  // Destacados
  {
    id: 1,
    titulo: "Curso de HTML",
    duracion_semanas: 4,
    precio: 50,
    categoria: "destacado",
    imagen: "../img/cursos/cursoHTML.png",
    descripcion: "Aprende a crear páginas web con HTML desde cero.",
    requisitos: "Ninguno",
    docente: {
      nombre: "Leonel Marger",
      rating: 4,
      bio: "Desarrollador Web con amplio conocimiento en frontend. Experiencia en docencia."
    },
    contenidos: [
      {
        unidad: "Introducción",
        temas: [
          "1.1 ¿Qué es HTML? - 10 min",
          "1.2 Estructura básica - 15 min",
          "1.3 Etiquetas principales - 20 min"
        ]
      },
      {
        unidad: "Unidad 2",
        temas: [
          "2.1 Listas y tablas - 25 min",
          "2.2 Formularios - 30 min"
        ]
      }
    ]
  },
  {
    id: 2,
    titulo: "Curso de CSS",
    duracion_semanas: 6,
    precio: 70,
    categoria: "destacado",
    imagen: "../img/cursos/cursoCSS.png",
    descripcion: "Aprende a diseñar y dar estilo profesional a tus páginas web con CSS3.",
    requisitos: "Conocimientos básicos de HTML",
    docente: {
      nombre: "Laura Martínez",
      rating: 5, // 5 estrellas
      bio: "Diseñadora web con 10 años de experiencia en UI/UX y desarrollo frontend."
    },
    contenidos: [
      {
        unidad: "Unidad 1 - Introducción a CSS",
        temas: [
          "1.1 Selectores básicos - 20 min",
          "1.2 Colores y tipografías - 25 min"
        ]
      },
      {
        unidad: "Unidad 2 - Modelo de caja",
        temas: [
          "2.1 Márgenes y paddings - 30 min",
          "2.2 Bordes y sombras - 20 min"
        ]
      },
      {
        unidad: "Unidad 3 - Diseño avanzado",
        temas: [
          "3.1 Flexbox - 40 min",
          "3.2 Grid Layout - 50 min"
        ]
      }
    ]
  },
  {
    id: 3,
    titulo: "Curso de JavaScript",
    duracion_semanas: 12,
    precio: 120,
    categoria: "destacado",
    imagen: "../img/cursos/cursoJS.png",
    descripcion: "Aprende a programar dinámicamente tus páginas web usando JavaScript desde cero.",
    requisitos: "Conocimientos básicos de HTML y CSS",
    docente: {
      nombre: "Pedro Rodriguez",
      rating: 5, // 5 estrellas
      bio: "Desarrollador web con amplio conocimiento FullStack."
    },
    contenidos: [
      {
        unidad: "Unidad 1 - Introducción a JavaScript",
        temas: [
          "1.1 ¿Qué es JavaScript? - 15 min",
          "1.2 Variables y tipos de datos - 20 min"
        ]
      },
      {
        unidad: "Unidad 2 - Funciones y eventos",
        temas: [
          "2.1 Funciones básicas - 20 min",
          "2.2 Eventos simples - 25 min"
        ]
      }
    ]
  },
  {
    id: 4,
    titulo: "Curso de Bases de Datos",
    duracion_semanas: 13,
    precio: 1200,
    categoria: "destacado",
    imagen: "../img/cursos/cursoSQL.png",
    descripcion: "Aprende a diseñar, gestionar y consultar bases de datos relacionales con SQL.",
    requisitos: "Conocimientos básicos de HTML y lógica de programación",
    docente: {
      nombre: "Sofia Martinez",
      rating: 5, // 5 estrellas
      bio: "Analista de datos con vasta experiencia en la docencia."
    },
    contenidos: [
      {
        unidad: "Unidad 1 - Introducción a Bases de Datos",
        temas: [
          "1.1 ¿Qué es una base de datos? - 15 min",
          "1.2 Tipos de bases de datos - 20 min"
        ]
      },
      {
        unidad: "Unidad 2 - SQL básico",
        temas: [
          "2.1 Consultas SELECT - 20 min",
          "2.2 INSERT, UPDATE y DELETE - 25 min"
        ]
      }
    ]
  },
  
  // Otros Cursos
  {
    id: 5,
    titulo: "Curso de Python Inicial",
    duracion_semanas: 8,
    precio: 95,
    categoria: "otro",
    imagen: "../img/cursos/cursoPY.png",
    descripcion: "Da tus primeros pasos en el mundo de la programación con Python, el lenguaje más demandado.",
    requisitos: "Ninguno, ¡solo ganas de aprender!",
    docente: {
      nombre: "Carlos Santana",
      rating: 5, // 5 estrellas
      bio: "Ingeniero en Software con 8 años de experiencia en desarrollo backend y ciencia de datos."
    },
    contenidos: [
      {
        unidad: "Unidad 1 - Fundamentos de Python",
        temas: [
          "1.1 Introducción y sintaxis básica - 20 min",
          "1.2 Variables, tipos de datos y operadores - 25 min"
        ]
      },
      {
        unidad: "Unidad 2 - Estructuras de Control",
        temas: [
          "2.1 Condicionales (if, else) - 30 min",
          "2.2 Bucles (for, while) - 35 min"
        ]
      }
    ]
  },
  {
    id: 6,
    titulo: "Curso de Diseño UI/UX",
    duracion_semanas: 7,
    precio: 80,
    categoria: "otro",
    imagen: "../img/cursos/cursoUIUX.png",
    descripcion: "Aprende a crear interfaces intuitivas y experiencias de usuario memorables.",
    requisitos: "Nociones de diseño gráfico son recomendables, pero no excluyentes.",
    docente: {
      nombre: "Mariana Gómez",
      rating: 5, // 5 estrellas
      bio: "Diseñadora de Producto con más de 10 años de experiencia en startups y grandes empresas."
    },
    contenidos: [
      {
        unidad: "Unidad 1 - Principios de UX",
        temas: [
          "1.1 ¿Qué es la Experiencia de Usuario? - 15 min",
          "1.2 User Research y Personas - 30 min"
        ]
      },
      {
        unidad: "Unidad 2 - Diseño de UI",
        temas: [
          "2.1 Wireframing y Prototipado - 40 min",
          "2.2 Sistemas de Diseño y Atomic Design - 35 min"
        ]
      }
    ]
  },
  {
    id: 7,
    titulo: "Curso de React.js",
    duracion_semanas: 10,
    precio: 150,
    categoria: "otro",
    imagen: "../img/cursos/cursoREACT.png",
    descripcion: "Domina la librería de JavaScript más popular para crear interfaces de usuario modernas y dinámicas.",
    requisitos: "Conocimientos sólidos de HTML, CSS y especialmente JavaScript (ES6+).",
    docente: {
      nombre: "Javier Milei", // El HTML indicaba "Javier Milei"
      rating: 4, // 4 estrellas (de ⭐⭐⭐⭐☆)
      bio: "Desarrollador Frontend especialista en el ecosistema de React. Apasionado por la performance web."
    },
    contenidos: [
      {
        unidad: "Unidad 1 - Fundamentos de React",
        temas: [
          "1.1 ¿Qué es React? JSX y Componentes - 30 min",
          "1.2 Props y State - 35 min"
        ]
      },
      {
        unidad: "Unidad 2 - Hooks y Ciclo de Vida",
        temas: [
          "2.1 useState y useEffect - 40 min",
          "2.2 Renderizado Condicional y Listas - 30 min"
        ]
      }
    ]
  },
  {
    id: 8,
    titulo: "Curso de Git y GitHub",
    duracion_semanas: 3,
    precio: 45,
    categoria: "otro",
    imagen: "../img/cursos/cursoGIT.png",
    descripcion: "Aprende a gestionar versiones de tu código y a colaborar en equipo como un profesional.",
    requisitos: "Conocimientos básicos de manejo de la terminal o línea de comandos.",
    docente: {
      nombre: "Ricardo Tapia",
      rating: 5, // 5 estrellas
      bio: "DevOps Engineer con experiencia en automatización de procesos y trabajo colaborativo."
    },
    contenidos: [
      {
        unidad: "Unidad 1 - Fundamentos de Git",
        temas: [
          "1.1 ¿Qué es el control de versiones? - 15 min",
          "1.2 Comandos básicos: add, commit, push - 30 min"
        ]
      },
      {
        unidad: "Unidad 2 - Ramas y Colaboración",
        temas: [
          "2.1 Creación y fusión de ramas (branches) - 35 min",
          "2.2 Flujo de trabajo con Pull Requests en GitHub - 25 min"
        ]
      }
    ]
  }
];