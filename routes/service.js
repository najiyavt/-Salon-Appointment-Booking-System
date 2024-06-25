const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const service = require('../controllers/service');

router.get('/get-Services' , auth.authenticate , service.getAllServices)
// router.post('/' , auth.authenticate , service.postNewService);

module.exports= router;