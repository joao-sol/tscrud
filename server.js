"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mysql2_1 = __importDefault(require("mysql2"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
const corsOptions = {
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
};
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(express_1.default.static('public'));
const db = mysql2_1.default.createConnection({
    host: 'db.multipass',
    user: 'jaolek',
    password: '2307jaolek',
    database: 'rent_game'
});
db.connect((err) => {
    if (err)
        throw err;
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
        if (err)
            return res.status(500).send(err);
        const resultSetHeader = result;
        res.status(201).send({ id: resultSetHeader.insertId });
        ;
    });
});
// Ler empréstimos
app.get('/emprestimos', (req, res) => {
    db.query('SELECT * FROM emprestimos', (err, results) => {
        if (err)
            return res.status(500).send(err);
        res.send(results);
    });
});
// Obter empréstimo por ID
app.get('/emprestimos/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM emprestimos WHERE ID = ?', [id], (err, results) => {
        if (err) {
            console.error("Erro ao consultar o banco:", err);
            return res.status(500).send({ error: "Erro ao consultar o banco" });
        }
        // Verificar se resultados foram retornados
        if (results.length === 0) {
            return res.status(404).send({ message: 'Empréstimo não encontrado' });
        }
        res.json(results[0]); // Retorna o primeiro resultado como JSON
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
        if (err)
            return res.status(500).send(err);
        res.send({ message: 'Empréstimo atualizado com sucesso!' });
    });
});
// Deletar empréstimo
app.delete('/emprestimos/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM emprestimos WHERE ID = ?', [id], (err) => {
        if (err)
            return res.status(500).send(err);
        res.send({ message: 'Empréstimo deletado com sucesso!' });
    });
});
app.listen(port, () => {
    console.log(`Servidor rodando em http://tscrud.com.br:${port}`);
});
