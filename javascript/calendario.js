const openModalHTML = document.querySelector('.curso__html');
const openModalJS = document.querySelector('.curso__js');
const modalHTML = document.getElementById('modal-html');
const modalJS = document.getElementById('modal-js');
const closeButtons = document.querySelectorAll('.modal__close');
openModalHTML.addEventListener('click', (e) => {
    e.preventDefault();
    modalHTML.classList.add('modal--show');
});
openModalJS.addEventListener('click', (e) => {
    e.preventDefault();
    modalJS.classList.add('modal--show');
});


closeButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = button.closest('.modal'); modal.classList.remove('modal--show');
    });
});