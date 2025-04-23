const router = require('express').Router();
const User = require('../controller/user');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const passport = require('passport');
const uploadImages = require('../config/cloudinary.config');

router.post('/register', User.register);
router.put('/finalregister/:token', User.finalRegister);
router.post('/login', User.loginUser);
router.get('/details', verifyAccessToken, User.getDetailsUser);
router.post('/refreshToken', User.refreshAccessToken);
router.get('/logout', User.logoutUser);
router.post('/forgotpassword', User.forgotPassword);
router.put('/resetpassword', User.resetPassword);
router.get('/alluser', [verifyAccessToken, isAdmin], User.getUsers);
router.delete(
    '/deletedUser/:uid',
    [verifyAccessToken, isAdmin],
    User.deleteUser
);
router.put(
    '/updateUser',
    verifyAccessToken,
    uploadImages.fields([{ name: 'avatar', maxCount: 1 }]),
    User.updateUser
);
router.put(
    '/updateUserByAdmin/:uid',
    [verifyAccessToken, isAdmin],
    User.updateUserByAdmin
);
router.put('/updateAddressUser', [verifyAccessToken], User.updateAddressUser);
router.put('/addCart', [verifyAccessToken], User.addCart);
router.delete('/removeCart/:pid', [verifyAccessToken], User.removeProuctInCart);
router.put('/wishlist/:pid', [verifyAccessToken], User.updateWishlist);

// Đăng nhập với Google
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
    '/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        if (!req.user) {
            return res
                .status(400)
                .json({ success: false, message: 'Authentication failed' });
        }

        // Tạo URL chứa AccessToken trong route params
        const redirectURL = `http://localhost:5173/profile/${req.user.accessToken}`;

        res.redirect(redirectURL);
    }
);
// Lấy thông tin user sau khi đăng nhập
router.get('/google/user', (req, res) => {
    res.json(req.user);
});

// Đăng xuất
router.get('/google/logout', (req, res) => {
    req.logout(() => {
        res.redirect('http://localhost:5173');
    });
});

// Đăng nhập với Facebook
router.get(
    '/facebook',
    passport.authenticate('facebook', { scope: ['email'] })
);

router.get(
    '/facebook/callback',
    passport.authenticate('facebook', { session: false }),
    (req, res) => {
        if (!req.user) {
            return res
                .status(400)
                .json({ success: false, message: 'Authentication failed' });
        }

        // Tạo URL chứa AccessToken trong route params
        const redirectURL = `http://localhost:5173/profile_fb/${req.user.accessToken}`;
        res.redirect(redirectURL);
    }
);

router.get('/facebook/user', (req, res) => {
    res.json(req.user);
});

router.get('/facebook/logout', (req, res) => {
    req.logout(() => {
        res.redirect('http://localhost:5173');
    });
});

module.exports = router;
