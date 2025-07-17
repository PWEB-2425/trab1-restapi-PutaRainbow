const Aluno = require('../models/Aluno');

exports.getAlunos = async (req, res) => {
  const alunos = await Aluno.find();
  res.json(alunos);
};

exports.getAlunoById = async (req, res) => {
  const aluno = await Aluno.findById(req.params.id);  
  if (!aluno) {
    return res.status(404).json({ error: 'Aluno não encontrado' });
  }
  res.json(aluno);
};

exports.addAluno = async (req, res) => {
  const novo = new Aluno(req.body);
  const salvo = await novo.save();
  res.status(201).json(salvo);
};

exports.updateAluno = async (req, res) => {
  const atualizado = await Aluno.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(atualizado);
};

exports.deleteAluno = async (req, res) => {
  console.log('DeleteAluno chamado');
  console.log('req.params:', req.params);

  try {
    const id = req.params.id;
    if (!id) {
      console.log('ID ausente no req.params');
      return res.status(400).json({ error: 'ID do aluno não fornecido' });
    }

    const deletado = await Aluno.findByIdAndDelete(id);
    if (!deletado) {
      console.log('Aluno não encontrado para deletar');
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    console.log('Aluno deletado:', deletado);
    res.status(204).end();
  } catch (err) {
    console.error('Erro ao deletar aluno:', err);
    res.status(400).json({ error: 'Erro ao deletar aluno' });
  }
};
