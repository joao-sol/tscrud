import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2';
import cors from 'cors';


const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'jaolek',
    password: '2307jaolek',
    database: 'rent_game'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao banco de dados MySQL!');
});

// Rotas CRUD

// Criar empréstimo
app.post('/emprestimos', (req, res) => {
    const { nome, data_emprest, data_devolv, status, cliente } = req.body;
    db.query('INSERT INTO emprestimos (nome, data_emprest, data_devolv, status, cliente) VALUES (?, ?, ?, ?, ?)', [nome, data_emprest, data_devolv, status, cliente], (err, result) => {
        if (err) return res.status(500).send(err);
        const resultSetHeader = result as mysql.ResultSetHeader;
res.status(201).send({ id: resultSetHeader.insertId });;
    });
});

// Ler empréstimos
app.get('/emprestimos', (req, res) => {
    db.query('SELECT * FROM emprestimos', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

// Atualizar empréstimo
app.put('/emprestimos/:id', (req, res) => {
    const { id } = req.params;
    const { nome, data_emprest, data_devolv, status, cliente } = req.body;
    db.query('UPDATE emprestimos SET nome = ?, data_emprest = ?, data_devolv = ?, status = ?, cliente = ? WHERE ID = ?', [nome, data_emprest, data_devolv, status, cliente, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Empréstimo atualizado com sucesso!' });
    });
});

// Deletar empréstimo
app.delete('/emprestimos/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM emprestimos WHERE ID = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Empréstimo deletado com sucesso!' });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
