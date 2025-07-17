const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Adicione esta linha
require('dotenv').config();

const Curso = require('./models/Curso'); // Importar o schema do curso

const alunoRoutes = require('./routes/alunoRoutes');
const cursoRoutes = require('./routes/cursoRoutes');

const app = express();
const PORT = process.env.PORT || 3000; // Mova para cima

app.use(cors());
app.use(express.json());

// Configuração correta para o frontend (supondo estrutura de pastas)
app.use(express.static(path.join(__dirname, '../frontend')));

// Rota principal - sirva o frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Rotas da API
app.use('/api/alunos', alunoRoutes);
app.use('/api/cursos', cursoRoutes);

// Conexão com MongoDB e inicialização única do servidor
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conectado ao MongoDB Atlas');
    app.listen(PORT, () => console.log(`Servidor na porta ${PORT}`)); 
  })
  .catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  });