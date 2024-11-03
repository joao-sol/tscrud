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
    
    const dataEmprest = data_emprest ? data_emprest : null;
    const dataDevolv = data_devolv ? data_devolv : null;
    const parceiro = cliente ? cliente : null;

    db.query('INSERT INTO emprestimos (nome, data_emprest, data_devolv, status, cliente) VALUES (?, ?, ?, ?, ?)', [nome, dataEmprest, dataDevolv, status, parceiro], (err, result) => {
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

import { RowDataPacket } from 'mysql2';

// Obter empréstimo por ID
app.get('/emprestimos/:id', (req, res) => {
    const { id } = req.params;

    db.query<RowDataPacket[]>('SELECT * FROM emprestimos WHERE ID = ?', [id], (err, results) => {
        if (err) {
            console.error("Erro ao consultar o banco:", err);
            return res.status(500).send({ error: "Erro ao consultar o banco" });
        }

        // Verificar se resultados foram retornados
        if (results.length === 0) {
            return res.status(404).send({ message: 'Empréstimo não encontrado' });
        }

        res.json(results[0]);  // Retorna o primeiro resultado como JSON
    });
});



// Atualizar empréstimo
app.put('/emprestimos/:id', (req, res) => {
    const { id } = req.params;
    const { nome, data_emprest, data_devolv, status, cliente } = req.body;
    const dataEmprest = data_emprest ? data_emprest : null;
    const dataDevolv = data_devolv ? data_devolv : null;
    const parceiro = cliente ? cliente : null;
    db.query('UPDATE emprestimos SET nome = ?, data_emprest = ?, data_devolv = ?, status = ?, cliente = ? WHERE ID = ?', [nome, dataEmprest, dataDevolv, status, parceiro, id], (err) => {
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
