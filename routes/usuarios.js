const express = require('express');
const { number } = require('xpress/lib/string');
const router = express.Router();

let users = [
  { nome: 'Jaozin_herobrine67', idade:7,  ehmaior: false },
  { nome: 'Alberto Morillas', idade:75,  ehmaior: true },
];

router.get('/', (req, res)=>  {

    res.status(200).send(users)
})

router.post('/', (req, res) => {
    let ehmaiorr = false;

    let idade = number(req.body.idade);
    if (Number(req.body.idade) >= 18){
        ehmaiorr = true;
    }
    
    const NovoUsuario = { nome: req.body.nome , idade:req.body.idade,  ehmaior: ehmaiorr };
    users.push(NovoUsuario)
    res.status(201).json(NovoUsuario)
})

// FAZER o delete, put e patch





module.exports = router;
