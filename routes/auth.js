const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.post('/register', authController.register );

router.post('/login', authController.login );

router.post('/avmregister', authController.avmregister );

router.post('/avmlogin', authController.avmlogin );

// router.post('/avmdownload', authController.avmdownload );

module.exports = router;