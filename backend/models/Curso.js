const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema({
  Id: Number,
  nomeDoCurso: String,
  duracao: Number,
});

module.exports = mongoose.model('Curso', cursoSchema);