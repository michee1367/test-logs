const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3434;

// Middleware pour lire les corps JSON et form-data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Chemin du fichier de logs
const logFile = path.join(__dirname, 'requests.log');

// Fonction utilitaire pour écrire dans le fichier
function logToFile(data) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${data}\n\n`;
  fs.appendFileSync(logFile, logEntry);
}

// Middleware de logging
app.use((req, res, next) => {
  const clientIp =
    req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'inconnue';

  const logData = {
    ip: clientIp,
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body
  };

  const message = `
=== Nouvelle requête ===
IP: ${clientIp}
Méthode: ${req.method}
URL: ${req.originalUrl}
Headers: ${JSON.stringify(req.headers, null, 2)}
Body: ${JSON.stringify(req.body, null, 2)}
========================
`;

  console.log(message);
  logToFile(message);
  res.json({ message: 'Requête reçue' });
  //next();
});

// Exemple de route
app.get('/', (req, res) => {
  res.send('✅ Service de log actif');
});

// Exemple POST
app.post('/test', (req, res) => {
  res.json({ message: 'Requête reçue', body: req.body });
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur en écoute sur le port ${PORT}`);
});
