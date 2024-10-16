const express = require('express');
const tryCatch = require('../middlewares/tryCatch');
const { login, register } = require('../controllers/authController');
const { upload } = require('../middlewares/multer');
const router = express.Router();

router.post('/register', upload.single('image'), tryCatch(register));
router.post('/login', tryCatch(login));

module.exports = router;
