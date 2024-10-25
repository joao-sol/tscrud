const form = document.getElementById('emprestimoForm');
const emprestimosList = document.getElementById('emprestimosList');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const novoEmprestimo = {
        nome: document.getElementById('nome').value,
        data_emprest: document.getElementById('data_emprest').value,
        data_devolv: document.getElementById('data_devolv').value,
        status: document.getElementById('status').value,
        cliente: document.getElementById('cliente').value
    };

    await fetch('http://localhost:3000/emprestimos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoEmprestimo)
    });

    carregarEmprestimos();
});

async function carregarEmprestimos() {
    const response = await fetch('http://localhost:3000/emprestimos');
    const emprestimos = await response.json();
    emprestimosList.innerHTML = emprestimos.map(emprestimo => `<li>${emprestimo.nome} - ${emprestimo.cliente}</li>`).join('');
}

window.onload = carregarEmprestimos;
