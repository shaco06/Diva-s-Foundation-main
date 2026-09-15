# Fundación Diva's

## Checkout de donaciones

Este proyecto usa Stripe Checkout para aceptar donaciones únicas y mensuales.

1. Instala Node.js LTS.
2. Abre una terminal en esta carpeta y ejecuta `npm install`.
3. Copia `.env.example` como `.env`.
4. Entra al Dashboard de Stripe, activa el modo de prueba y coloca tu clave secreta `sk_test_...` en `STRIPE_SECRET_KEY`.
5. Ejecuta `npm start`.
6. Abre `http://localhost:3000`.

La cuenta que recibe el dinero es la cuenta comercial conectada al Dashboard de Stripe. Para pagos reales, reemplaza la clave de prueba por una clave activa y configura la información bancaria y de identidad solicitada por Stripe.

El servidor crea pagos únicos con `mode: payment` y donaciones mensuales con `mode: subscription`. El navegador nunca recibe la clave secreta.

`STRIPE_CURRENCY` está configurada como `crc` y `STRIPE_CURRENCY_MULTIPLIER` como `100`. Si la cuenta o el proveedor requiere otra moneda, cambia ambos valores en `.env`.