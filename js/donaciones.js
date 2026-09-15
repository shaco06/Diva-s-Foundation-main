const sinpeModal = document.querySelector('#sinpe-modal');
const abrirSinpe = document.querySelector('#abrir-sinpe');
const cerrarSinpe = document.querySelector('#cerrar-sinpe');
const sinpeNumero = document.querySelector('#sinpe-numero');
const sinpeTitular = document.querySelector('#sinpe-titular');
const numeroSinpe = '8302 4260';
const titularSinpe = "Fundación Diva's";

const cerrarModalSinpe = () => {
    sinpeModal.hidden = true;
};

const abrirModalSinpe = () => {
    sinpeNumero.textContent = numeroSinpe;
    sinpeTitular.textContent = `Titular: ${titularSinpe}`;
    sinpeModal.hidden = false;
};

abrirSinpe.addEventListener('click', abrirModalSinpe);
cerrarSinpe.addEventListener('click', cerrarModalSinpe);
sinpeModal.addEventListener('click', (evento) => {
    if (evento.target === sinpeModal) {
        cerrarModalSinpe();
    }
});
