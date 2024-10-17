const express = require('express');
const tryCatch = require('../middlewares/tryCatch');
const {
  login,
  register,
  getAllUsers,
  updateUserProfile,
  getUserProfile,
} = require('../controllers/userController');
const { upload } = require('../middlewares/multer');
const checkAuth = require('../middlewares/checkAuth');
const router = express.Router();

router.get('/', checkAuth, tryCatch(getAllUsers));
router.post('/register', upload.single('image'), tryCatch(register));
router.post('/login', tryCatch(login));
router.get('/:userId', checkAuth, tryCatch(getUserProfile));
router.put('/:userId', checkAuth, upload.single('image'), tryCatch(updateUserProfile));

module.exports = router;
