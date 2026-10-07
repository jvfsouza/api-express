const express = require('express');
const router = express.Router();

const imagens = [
  { id: 1, nome: 'logo.png', descricao: 'Logo institucional' },
  { id: 2, nome: 'banner.jpg', descricao: 'Banner principal' },
];

router.get('/', (req, res) => {
  res.status(200).send(imagens);
});

module.exports = router;

