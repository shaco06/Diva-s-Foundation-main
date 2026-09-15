require('dotenv').config();

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? require('stripe')(stripeKey) : null;
const rootDirectory = __dirname;
const port = Number(process.env.PORT || 3000);
const publicBaseUrl = process.env.PUBLIC_BASE_URL || `http://localhost:${port}`;
const currency = (process.env.STRIPE_CURRENCY || 'crc').toLowerCase();
const currencyMultiplier = Number(process.env.STRIPE_CURRENCY_MULTIPLIER || 100);

const sendJson = (response, statusCode, data) => {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(data));
};

const createCheckoutSession = async (request, response) => {
  if (!stripe) {
    sendJson(response, 503, { error: 'Configura STRIPE_SECRET_KEY en el archivo .env.' });
    return;
  }

  let body = '';
  request.on('data', (chunk) => {
    body += chunk;
    if (body.length > 10_000) {
      request.destroy();
    }
  });

  request.on('end', async () => {
    try {
      const { amount, donationType } = JSON.parse(body);
      const numericAmount = Number(amount);

      if (!Number.isInteger(numericAmount) || numericAmount < 1 || numericAmount > 10_000_000) {
        sendJson(response, 400, { error: 'El monto de donación no es válido.' });
        return;
      }

      if (!['unica', 'mensual'].includes(donationType)) {
        sendJson(response, 400, { error: 'El tipo de donación no es válido.' });
        return;
      }

      const session = await stripe.checkout.sessions.create({
        mode: donationType === 'mensual' ? 'subscription' : 'payment',
        line_items: [{
          quantity: 1,
          price_data: {
            currency,
            unit_amount: numericAmount * currencyMultiplier,
            product_data: {
              name: donationType === 'mensual' ? 'Donación mensual' : 'Donación única'
            },
            ...(donationType === 'mensual'
              ? { recurring: { interval: 'month' } }
              : {})
          }
        }],
        metadata: {
          donation_type: donationType,
          amount: String(numericAmount)
        },
        success_url: `${publicBaseUrl}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${publicBaseUrl}/?payment=cancelled`
      });

      sendJson(response, 200, { url: session.url });
    } catch (error) {
      console.error('Error creando Checkout Session:', error.message);
      sendJson(response, 500, { error: 'No se pudo iniciar el pago. Intenta nuevamente.' });
    }
  });
};

const serveStaticFile = (request, response) => {
  const requestedPath = request.url === '/' ? '/index.html' : request.url.split('?')[0];
  const filePath = path.normalize(path.join(rootDirectory, requestedPath));

  if (!filePath.startsWith(rootDirectory)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, file) => {
    if (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 500);
      response.end('Not found');
      return;
    }

    const contentTypes = {
      '.css': 'text/css; charset=utf-8',
      '.html': 'text/html; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    };
    response.writeHead(200, { 'Content-Type': contentTypes[path.extname(filePath)] || 'application/octet-stream' });
    response.end(file);
  });
};

const server = http.createServer((request, response) => {
  if (request.method === 'POST' && request.url === '/api/create-checkout-session') {
    createCheckoutSession(request, response);
    return;
  }

  if (request.method === 'GET') {
    serveStaticFile(request, response);
    return;
  }

  sendJson(response, 405, { error: 'Método no permitido.' });
});

server.listen(port, () => {
  console.log(`Fundación Diva's disponible en ${publicBaseUrl}`);
});