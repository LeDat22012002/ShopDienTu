const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('./models/user');
const {
    generateAccessToken,
    generateRefreshToken,
} = require('./middlewares/jwt'); // Import hàm JWT
const jwt = require('jsonwebtoken');
require('dotenv').config();

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:
                'https://shopdientu-rg6y.onrender.com/api/user/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    user = await User.create({
                        googleId: profile.id,
                        name: profile.name.givenName || profile.displayName,
                        email: profile.emails[0].value,
                        avatar: profile.photos[0].value,
                        loginType: profile.provider,
                    });
                }

                // **Tạo AccessToken và RefreshToken**
                const newAccessToken = generateAccessToken(user._id, user.role);
                const newRefreshToken = generateRefreshToken(user._id);

                // **Lưu refreshToken vào Database**
                await User.findByIdAndUpdate(user._id, {
                    refreshToken: newRefreshToken,
                });

                return done(null, {
                    ...user.toObject(),
                    accessToken: newAccessToken, // **Thêm accessToken vào đây**
                    refreshToken: newRefreshToken,
                });
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// **Facebook Strategy**
passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL:
                'https://shopdientu-rg6y.onrender.com/api/user/facebook/callback',
            profileFields: ['id', 'displayName', 'email', 'photos'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ facebookId: profile.id });

                if (!user) {
                    user = await User.create({
                        facebookId: profile.id,
                        name: profile.displayName,
                        email: profile.emails?.[0]?.value || '',
                        avatar: profile.photos?.[0]?.value || '',
                        loginType: 'facebook',
                    });
                }

                // Tạo AccessToken và RefreshToken
                const newAccessToken = generateAccessToken(user._id, user.role);
                const newRefreshToken = generateRefreshToken(user._id);

                // Lưu refreshToken vào Database
                await User.findByIdAndUpdate(user._id, {
                    refreshToken: newRefreshToken,
                });

                return done(null, {
                    ...user.toObject(),
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                });
            } catch (error) {
                return done(error, null);
            }
        }
    )
);
