const express = require('express');
const router = express.Router();

const passwordController = require('../controllers/forgotPassword');
const auth = require('../middleware/auth');


router.post('/forgotpassword' ,auth.authenticate, passwordController.forgotPassword)
router.get('/reset/:id' ,auth.authenticate, passwordController.resetPassword);
router.post('/update/:id' ,auth.authenticate, passwordController.updatePassword)

module.exports=router;