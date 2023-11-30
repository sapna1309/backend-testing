const express = require('express');
// const multer = require('multer');
const router = express.Router();
const { submitForm, getRegistrationForm, loginUserRegistration, getCurrentUser, updateUser, applyFilter, updateFollow } = require('../controllers/userController');
const {verifyToken} = require("../controllers/authController")


// const singleStorage = multer.memoryStorage()

// const upload = multer({ dest: "uploads/" });
// const singleUpload = multer({ storage: singleStorage })

router.patch('/update-registration-form/:userId', updateUser);
router.patch('/updateFollow/:userId', updateFollow)

router.post('/submit-registration-form', submitForm);
router.get('/registration-form', verifyToken, getRegistrationForm);
router.get('/registration-form/:id', getCurrentUser)
router.post('/login', loginUserRegistration);
router.post('/apply-filter',verifyToken, applyFilter);

module.exports = router;
