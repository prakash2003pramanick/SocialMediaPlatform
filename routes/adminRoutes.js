const express = require('express');
const router = express.Router();
const { approveSociety, refuseSociety } = require('../controllers/admin/societyController');
const superAdminController = require('../controllers/admin/adminController');
const { verifyToken } = require('../middleware/verifyToken');

router.post('/approve-society', verifyToken, approveSociety); // tested
router.post('/refuse-society', verifyToken, refuseSociety); // tested

// Create an admin
router.post('/create-admin', verifyToken, superAdminController.createAdmin); //tested
// Update an admin
router.post('/update-admin', verifyToken, superAdminController.updateAdmin); //tested
// Delete an admin
router.delete('/delete-admin/:id', verifyToken, superAdminController.deleteAdmin); //tested
router.post('/delete-admin', verifyToken, superAdminController.deleteAdmin); //tested

// Get all the admin details
router.get('/fetch-admin/:id', verifyToken, superAdminController.getAdmin); //tested
router.post('/fetch-admin', verifyToken, superAdminController.getAdmin); //tested
router.get('/fetch-all-admin',verifyToken, superAdminController.getAllAdmin); //tested
router.post('/fetch-admin-actions',verifyToken, superAdminController.getAdminActions); //allow fetch by email also <- not impelemted



module.exports = router;

