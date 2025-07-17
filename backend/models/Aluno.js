const mongoose = require('mongoose');

const alunoSchema = new mongoose.Schema({
  nome: String,
  apelido: String,
  idade: Number,
  cursoID: Number,
  anoCurricular: Number
});

module.exports = mongoose.model('Aluno', alunoSchema);