const express = require('express');
const router = express.Router();
const path = require('path');

// Serve arquivos estáticos (CSS, imagens, JS do front-end) da pasta "public"
router.use(express.static(path.join(__dirname, 'public')));

// Rota principal para enviar a página HTML
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'vibecoded.html'));
});

module.exports = router;

