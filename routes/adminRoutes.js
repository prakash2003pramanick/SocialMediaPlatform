const express = require('express');
const router = express.Router();
const { approveSociety } = require('../controllers/adminController');
const { verifyToken } = require('../middleware/verifyToken');

router.post('/approve-society', verifyToken, approveSociety);


module.exports = router;

