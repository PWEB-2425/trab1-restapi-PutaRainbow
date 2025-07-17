const express = require('express');
const router = express.Router();
const controller = require('../controllers/cursoController');

router.get('/', controller.getCursos);

module.exports = router;