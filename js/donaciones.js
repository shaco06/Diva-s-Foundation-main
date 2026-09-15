const formularioDonacion = document.querySelector('#formulario-donacion');
const botonesMonto = formularioDonacion.querySelectorAll('[data-amount]');
const otroMonto = document.querySelector('#otro-monto');
const mensajeDonacion = document.querySelector('#mensaje-donacion');
const continuarDonacion = document.querySelector('#continuar-donacion');
const tiposDonacion = formularioDonacion.querySelectorAll('input[name="tipoDonacion"]');
const controlesMonto = [...botonesMonto, otroMonto];
const sinpeModal = document.querySelector('#sinpe-modal');
const cerrarSinpe = document.querySelector('#cerrar-sinpe');
const sinpeNumero = document.querySelector('#sinpe-numero');
const sinpeTitular = document.querySelector('#sinpe-titular');
const sinpeComprobante = document.querySelector('#sinpe-comprobante');
const confirmarSinpe = document.querySelector('#confirmar-sinpe');
const sinpeMensaje = document.querySelector('#sinpe-mensaje');
const metodosPago = document.querySelectorAll('input[name="metodoPago"]');
const pagoInstrucciones = document.querySelector('#pago-instrucciones');
const pagoComprobanteInstrucciones = document.querySelector('#pago-comprobante-instrucciones');

let metodoPagoSeleccionado = 'sinpe';

const actualizarDatosMetodo = (monto) => {
    const esSinpe = metodoPagoSeleccionado === 'sinpe';
    sinpeNumero.textContent = esSinpe ? CONFIGURACION_SINPE.numero : CONFIGURACION_SINPE.transferencia.cuenta;
    sinpeTitular.textContent = esSinpe
        ? `Titular: ${CONFIGURACION_SINPE.titular} | Monto: ₡${monto.toLocaleString('es-CR')}`
        : `Banco: ${CONFIGURACION_SINPE.transferencia.banco} | Titular: ${CONFIGURACION_SINPE.titular} | Monto: ₡${monto.toLocaleString('es-CR')}`;
    pagoInstrucciones.textContent = esSinpe
        ? 'Envía el monto exacto al número SINPE Móvil:'
        : 'Realiza una transferencia bancaria por el monto exacto a estos datos:';
    pagoComprobanteInstrucciones.textContent = esSinpe
        ? 'Después de realizar el SINPE, escribe el número de comprobante para registrar tu donación.'
        : 'Después de realizar la transferencia, escribe el número de comprobante para registrar tu donación.';
    sinpeComprobante.placeholder = esSinpe ? 'Ej. 123456789' : 'Ej. número de transferencia';
    confirmarSinpe.textContent = esSinpe ? 'Ya realicé el SINPE' : 'Ya realicé la transferencia';
};

const cerrarModalSinpe = () => {
    sinpeModal.hidden = true;
    sinpeComprobante.value = '';
    sinpeMensaje.textContent = '';
};

const abrirModalSinpe = (monto) => {
    metodoPagoSeleccionado = 'sinpe';
    document.querySelector('input[name="metodoPago"][value="sinpe"]').checked = true;
    actualizarDatosMetodo(monto);
    sinpeModal.hidden = false;
    sinpeComprobante.focus();
};

metodosPago.forEach((metodo) => {
    metodo.addEventListener('change', () => {
        metodoPagoSeleccionado = metodo.value;
        const monto = Number(otroMonto.value || formularioDonacion.dataset.amount);
        actualizarDatosMetodo(monto);
        sinpeMensaje.textContent = '';
    });
});

cerrarSinpe.addEventListener('click', cerrarModalSinpe);
sinpeModal.addEventListener('click', (evento) => {
    if (evento.target === sinpeModal) {
        cerrarModalSinpe();
    }
});

confirmarSinpe.addEventListener('click', () => {
    const comprobante = sinpeComprobante.value.trim();

    if (comprobante.length < 4) {
        sinpeMensaje.textContent = 'Escribe un número de comprobante válido.';
        sinpeComprobante.focus();
        return;
    }

    const monto = Number(otroMonto.value || formularioDonacion.dataset.amount);
    const tipo = formularioDonacion.dataset.type === 'mensual' ? 'mensual' : 'única';
    const nombreMetodo = metodoPagoSeleccionado === 'sinpe' ? 'SINPE Móvil' : 'transferencia bancaria';
    const mensajeWhatsapp = [
        `Hola, quiero registrar una donación ${tipo}.`,
        `Método de pago: ${nombreMetodo}`,
        `Monto: ₡${monto.toLocaleString('es-CR')}`,
        `Comprobante: ${comprobante}`
    ].join('\n');
    const numeroWhatsapp = CONFIGURACION_SINPE.whatsapp.replace(/\D/g, '');
    const enlaceWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensajeWhatsapp)}`;

    cerrarModalSinpe();
    window.open(enlaceWhatsapp, '_blank', 'noopener');
    mensajeDonacion.textContent = 'Se abrió WhatsApp con la información de tu donación. Confirma el envío del mensaje.';
});

const actualizarEstadoContinuar = () => {
    const monto = Number(otroMonto.value || formularioDonacion.dataset.amount);
    continuarDonacion.disabled = !formularioDonacion.dataset.type || !monto || monto < 1;
};

tiposDonacion.forEach((tipo) => {
    tipo.addEventListener('change', () => {
        formularioDonacion.dataset.type = tipo.value;
        controlesMonto.forEach((control) => {
            control.disabled = false;
        });
        actualizarEstadoContinuar();
        const periodicidad = tipo.value === 'mensual' ? 'mensual' : 'única';
        mensajeDonacion.textContent = `Donación ${periodicidad} seleccionada. Ahora elige el monto.`;
    });
});

botonesMonto.forEach((boton) => {
    boton.addEventListener('click', () => {
        botonesMonto.forEach((opcion) => {
            opcion.classList.remove('is-selected');
            opcion.setAttribute('aria-pressed', 'false');
        });
        boton.classList.add('is-selected');
        boton.setAttribute('aria-pressed', 'true');
        otroMonto.value = '';
        formularioDonacion.dataset.amount = boton.dataset.amount;
        actualizarEstadoContinuar();
        const periodicidad = formularioDonacion.dataset.type === 'mensual' ? 'mensual' : 'única';
        mensajeDonacion.textContent = `Monto seleccionado: ₡${boton.dataset.amount} para una donación ${periodicidad}.`;
    });
});

otroMonto.addEventListener('input', () => {
    botonesMonto.forEach((opcion) => {
        opcion.classList.remove('is-selected');
        opcion.setAttribute('aria-pressed', 'false');
    });
    formularioDonacion.dataset.amount = otroMonto.value;
    actualizarEstadoContinuar();
    const periodicidad = formularioDonacion.dataset.type === 'mensual' ? 'mensual' : 'única';
    mensajeDonacion.textContent = otroMonto.value ? `Monto seleccionado: ₡${otroMonto.value} para una donación ${periodicidad}.` : '';
});

formularioDonacion.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const tipo = formularioDonacion.dataset.type;
    const monto = Number(otroMonto.value || formularioDonacion.dataset.amount);

    if (!tipo) {
        mensajeDonacion.textContent = 'Selecciona si tu donación será única o mensual.';
        return;
    }

    if (!monto || monto < 1) {
        mensajeDonacion.textContent = 'Selecciona un monto para continuar.';
        otroMonto.focus();
        return;
    }

    if (tipo === 'unica') {
        abrirModalSinpe(monto);
        return;
    }

    if (window.location.protocol === 'file:') {
        mensajeDonacion.textContent = 'Inicia el servidor con "npm start" y abre http://localhost:3000 para continuar con el pago.';
        return;
    }

    const ventanaPago = window.open('', '_blank');
    continuarDonacion.disabled = true;
    mensajeDonacion.textContent = 'Abriendo el pago seguro...';

    fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: monto, donationType: tipo })
    })
        .then(async (respuesta) => {
            const contenido = await respuesta.text();
            let data = {};

            try {
                data = contenido ? JSON.parse(contenido) : {};
            } catch {
                throw new Error(`El servidor devolvió una respuesta inválida (${respuesta.status}).`);
            }

            if (!respuesta.ok) {
                throw new Error(data.error || 'No se pudo iniciar el pago.');
            }

            if (!data.url) {
                throw new Error('El servidor no devolvió un enlace de pago.');
            }

            return data;
        })
        .then(({ url }) => {
            if (ventanaPago) {
                ventanaPago.location.href = url;
            } else {
                window.location.href = url;
            }
        })
        .catch((error) => {
            if (ventanaPago) {
                ventanaPago.close();
            }
            continuarDonacion.disabled = false;
            mensajeDonacion.textContent = error.message;
        });
});