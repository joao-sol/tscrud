const form = document.getElementById('emprestimoForm');
const emprestimosList = document.getElementById('emprestimosList');
let editMode = false;
let editId = null;

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const novoEmprestimo = {
        nome: document.getElementById('nome').value,
        data_emprest: document.getElementById('data_emprest').value,
        data_devolv: document.getElementById('data_devolv').value,
        status: document.getElementById('status').value,
        cliente: document.getElementById('cliente').value
    };

    if (editMode) {
        // Atualiza empréstimo
        await fetch(`http://10.114.88.134:3000/emprestimos/${editId}`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoEmprestimo)
        });
        editMode = false;
        editId = null;
    } else {
        //Adiciona um novo empréstimo
        await fetch('http://10.114.88.134:3000/emprestimos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoEmprestimo)
        });
    }

    form.reset();
    carregarEmprestimos();


});

// Função para editar um empréstimo
async function editarEmprestimo(id) {
    try {
        const response = await fetch(`http://10.114.88.134:3000/emprestimos/${id}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar o empréstimo: ${response.status}`);
        }
        
        const emprestimo = await response.json();
        
        document.getElementById('nome').value = emprestimo.nome;
        document.getElementById('data_emprest').value = emprestimo.data_emprest || null;
        document.getElementById('data_devolv').value = emprestimo.data_devolv || null;
        document.getElementById('status').value = emprestimo.status;
        document.getElementById('cliente').value = emprestimo.cliente;

        editMode = true;
        editId = id;
    } catch (error) {
        console.error("Erro ao carregar o empréstimo para edição:", error);
    }
}



async function deletarEmprestimo(id) {
    await fetch(`http://10.114.88.134:3000/emprestimos/${id}`, {
        method: 'DELETE'
    });
    carregarEmprestimos();
}

async function carregarEmprestimos() {
    const response = await fetch('http://10.114.88.134:3000/emprestimos');
    const emprestimos = await response.json();
    emprestimosList.innerHTML = emprestimos.map(emprestimo => `<li> 
        ${emprestimo.ID} - ${emprestimo.nome} - ${emprestimo.cliente} - ${emprestimo.data_emprest} - ${emprestimo.data_devolv} ${emprestimo.status} <button onclick="editarEmprestimo(${emprestimo.ID})">Editar</button>
        <button onclick="deletarEmprestimo(${emprestimo.ID})">Deletar</button>
    </li>`).join('');
}

window.onload = carregarEmprestimos;
