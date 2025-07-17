const Curso = require('../models/Curso');

exports.getCursos = async (req, res) => {
  const cursos = await Curso.find();
  res.json(cursos);
};