const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');

router.post('/add', candidateController.addCandidate);
router.get('/', candidateController.getCandidates);
router.post('/vote', candidateController.voteCandidate);
router.get('/results', candidateController.getResults);

module.exports = router;
