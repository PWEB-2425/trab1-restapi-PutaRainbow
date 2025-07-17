const express = require('express');
const router = express.Router();
const controller = require('../controllers/alunoController');

router.get('/', controller.getAlunos);
router.get('/:id', controller.getAlunoById);
router.post('/', controller.addAluno);
router.put('/:id', controller.updateAluno);
router.delete('/:id', controller.deleteAluno);

module.exports = router;
