const express = require('express');
const tryCatch = require('../middlewares/tryCatch');
const { login, register, getAllUsers } = require('../controllers/userController');
const { upload } = require('../middlewares/multer');
const checkAuth = require('../middlewares/checkAuth');
const router = express.Router();

router.post('/register', upload.single('image'), tryCatch(register));
router.post('/login', tryCatch(login));
router.get('/', checkAuth, tryCatch(getAllUsers));

module.exports = router;
