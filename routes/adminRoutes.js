const express = require('express');
const router = express.Router();
const { approveSociety, refuseSociety } = require('../controllers/admin/societyController');
const superAdminController = require('../controllers/admin/adminController');
const { verifyToken } = require('../middleware/verifyToken');

router.post('/approve-society', verifyToken, approveSociety);
router.post('/refuse-society', verifyToken, refuseSociety);

// Create an admin
router.post('/create-admin', verifyToken, superAdminController.createAdmin);
// Update an admin
router.post('/update-admin', verifyToken, superAdminController.updateAdmin);
// Delete an admin
router.get('/delete-admin/:id', verifyToken, superAdminController.deleteAdmin);
router.post('/delete-admin', verifyToken, superAdminController.deleteAdmin);

// Get all the admin details
router.get('/fetch-admin/:id', verifyToken, superAdminController.getAdmin);
router.post('/fetch-admin', verifyToken, superAdminController.getAdmin);
router.post('/fetch-all-admin',verifyToken,superAdminController.getAllAdmin);



module.exports = router;

