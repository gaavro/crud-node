import express from "express";
import { v1 as uuidv1, v4 as uuidv4, v5 as uuidv5 } from 'uuid';

const app = express();

app.listen(3000);

const notes= []


const cpfExists = (req, res, next) => {
    const { cpf } = req.params;
    const restaurant = cpf.find(cpf => cpf.id === parseInt(id));

    if (cpf === undefined) {
        return res.status(404).json({ error: "invalid cpf - user is not registered" });
    }

    next();
} 


app.get('/users', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.json({message: "Hello World!"});
});


app.post('/users', cpfExists, (req, res) => {    
    const { name, cpf } = req.body;
    res.status(201).json({message: "Resource created!"});
});