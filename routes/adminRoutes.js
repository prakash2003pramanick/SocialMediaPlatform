const express = require('express');
const router = express.Router();
const { approveSociety, refuseSociety } = require('../controllers/adminController');
const { verifyToken } = require('../middleware/verifyToken');

router.post('/approve-society', verifyToken, approveSociety);
router.post('/refuse-society', verifyToken, refuseSociety);



module.exports = router;

