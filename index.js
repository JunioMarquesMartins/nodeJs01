const express = require('express');


const server = express();

server.use(express.json());

const users = ['Diego', 'Junio', 'Carlos'];

server.use((req, res, next) => {
    console.time('Request');
    console.log(`Método: ${req.method}; ${req.url}`);
    next();
    console.timeEnd('Request');
});

function checkUserExists(req, res, next) {
    if(!req.body.name) {
        return res.status(400).json({ erro: 'Use name is required' });
    }
    return next();
}

function checkUserInArray(req, res, next) {

    const user = users[req.params.index];
    if(!user) {
        return res.status(400).json({ erro: 'Use name is not existing' });
    }
    req.user = user;

    return next();
}

// CRUD - Create, Read, Update, Delete
server.get('/users', (req, res) => {
    return res.json(users);
});

// Query params = ?teste=1
server.get('/teste', (req, res) => {
    const nome = req.query.nome;
    return res.json({ message: `Hello ${nome}`});
});
// Route params = /users/1
server.get('/users/:index', checkUserInArray, (req, res) => {
    return res.json(req.user);
});
// Request body = { "name": "Diego", "email": "diego@rocketseat.com.br" }
server.post('/users', checkUserExists, (req, res) => {
    const { name } = req.body;
    users.push(name);
    return res.json( users );
});

server.put('/users/:index', checkUserExists, checkUserInArray, (req, res) => {
    const { index } = req.params;
    const { name } = req.body;

    users[index] = name;

    return res.json(users);
});

server.delete('/users/:index', checkUserInArray, (req, res) => {
    const { index } = req.params;

    users.splice(index, 1);

    return res.json(users);
});

server.listen(3000);