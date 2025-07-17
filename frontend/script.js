// URLs das APIs
const ALUNOS_API_URL = 'http://localhost:3000/api/alunos';
const CURSOS_API_URL = 'http://localhost:3000/api/cursos';

// Referências ao DOM
const alunosTableBody = document.getElementById('alunosTableBody');
const studentForm = document.getElementById('studentForm');
const editStudentForm = document.getElementById('editStudentForm');
const editModal = document.getElementById('editModal');
const closeModalButton = document.querySelector('.close-button');

// Inputs do formulário
const nomeInput = document.getElementById('nome');
const apelidoInput = document.getElementById('apelido');
const idadeInput = document.getElementById('idade');
const cursoIDSelect = document.getElementById('cursoID');

const editIdInput = document.getElementById('editId');
const editNomeInput = document.getElementById('editNome');
const editApelidoInput = document.getElementById('editApelido');
const editIdadeInput = document.getElementById('editIdade');
const editCursoIDSelect = document.getElementById('editCursoID');

let todosOsCursos = [];

async function fetchAlunosECursos() {
    try {
        const [alunosResponse, cursosResponse] = await Promise.all([
            fetch(ALUNOS_API_URL),
            fetch(CURSOS_API_URL)
        ]);

        if (!alunosResponse.ok || !cursosResponse.ok) {
            throw new Error('Erro ao buscar dados.');
        }

        const alunos = await alunosResponse.json();
        todosOsCursos = await cursosResponse.json();

        popularCursosSelects();
        renderAlunos(alunos);
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        alunosTableBody.innerHTML = '<tr><td colspan="6">Erro ao carregar dados.</td></tr>';
    }
}

function popularCursosSelects() {
    cursoIDSelect.innerHTML = '<option value="">Selecione um curso</option>';
    editCursoIDSelect.innerHTML = '<option value="">Selecione um curso</option>';

    todosOsCursos.forEach(curso => {
        const option = document.createElement('option');
        option.value = curso.id;
        option.textContent = curso.nome;
        cursoIDSelect.appendChild(option);

        const editOption = option.cloneNode(true);
        editCursoIDSelect.appendChild(editOption);
    });
}

function renderAlunos(alunos) {
    alunosTableBody.innerHTML = '';
    if (alunos.length === 0) {
        alunosTableBody.innerHTML = '<tr><td colspan="6">Nenhum aluno encontrado.</td></tr>';
        return;
    }

    alunos.forEach(aluno => {
        const curso = todosOsCursos.find(c => c.id == aluno.cursoID);
        const nomeCurso = curso ? curso.nome : 'Curso Indefinido';

        const row = alunosTableBody.insertRow();
        row.innerHTML = `
            <td>${aluno.nome}</td>
            <td>${aluno.apelido || ''}</td>
            <td>${aluno.idade}</td>
            <td>${nomeCurso}</td>
            <td class="action-buttons">
                <button class="edit-button" data-id="${aluno._id}">Editar</button>
                <button class="delete-button" data-id="${aluno._id}">Apagar</button>
            </td>
        `;
    });

    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', (e) => openEditModal(e.target.dataset.id));
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', (e) => deleteAluno(e.target.dataset.id));
    });
}

studentForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = nomeInput.value;
    const apelido = apelidoInput.value;
    const idade = parseInt(idadeInput.value);
    const cursoID = cursoIDSelect.value;

    if (!cursoID) {
        alert("Por favor, selecione um curso.");
        return;
    }

    const newAluno = { nome, apelido, idade, cursoID: parseInt(cursoID) };

    try {
        const response = await fetch(ALUNOS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newAluno)
        });

        if (!response.ok) throw new Error('Erro ao adicionar aluno.');

        nomeInput.value = '';
        apelidoInput.value = '';
        idadeInput.value = '';
        cursoIDSelect.value = '';
        fetchAlunosECursos();
    } catch (error) {
        console.error("Erro ao adicionar aluno:", error);
        alert("Erro ao adicionar aluno. Verifique o console para mais detalhes.");
    }
});

async function openEditModal(id) {
    try {
        const response = await fetch(`${ALUNOS_API_URL}/${id}`);
        if (!response.ok) throw new Error('Erro ao buscar aluno.');

        const aluno = await response.json();

        editIdInput.value = aluno._id;
        editNomeInput.value = aluno.nome;
        editApelidoInput.value = aluno.apelido || '';
        editIdadeInput.value = aluno.idade;
        editCursoIDSelect.value = aluno.cursoID;

        editModal.style.display = 'block';
    } catch (error) {
        console.error("Erro ao carregar dados do aluno para edição:", error);
        alert("Erro ao carregar dados do aluno para edição.");
    }
}

closeModalButton.addEventListener('click', () => {
    editModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == editModal) {
        editModal.style.display = 'none';
    }
});

editStudentForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = editIdInput.value;
    const nome = editNomeInput.value;
    const apelido = editApelidoInput.value;
    const idade = parseInt(editIdadeInput.value);
    const cursoID = editCursoIDSelect.value;

    if (!cursoID) {
        alert("Por favor, selecione um curso.");
        return;
    }

    const updatedAluno = { nome, apelido, idade, cursoID: parseInt(cursoID) };

    try {
        const response = await fetch(`${ALUNOS_API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedAluno)
        });

        if (!response.ok) throw new Error('Erro ao atualizar aluno.');

        editModal.style.display = 'none';
        fetchAlunosECursos();
    } catch (error) {
        console.error("Erro ao atualizar aluno:", error);
        alert("Erro ao atualizar aluno. Verifique o console para mais detalhes.");
    }
});

async function deleteAluno(id) {
    if (!confirm("Tem certeza que deseja apagar este aluno?")) return;

    try {
        const response = await fetch(`${ALUNOS_API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erro ao apagar aluno.');

        fetchAlunosECursos();
    } catch (error) {
        console.error("Erro ao apagar aluno:", error);
        alert("Erro ao apagar aluno. Verifique o console para mais detalhes.");
    }
}

document.addEventListener('DOMContentLoaded', fetchAlunosECursos);
