const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const dbConnect = require('./config/dbconnect');
const initRoutes = require('./routes');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('./Passport');
const cron = require('node-cron');
const { autoDeactivateExpiredPromotions } = require('./controller/promotion');

const app = express();
app.use(
    cors({
        origin: process.env.CLIENT_ULR,
        methods: ['POST', 'PUT', 'GET', 'DELETE'],
        credentials: true,
    })
);
app.use(cookieParser());
const port = process.env.PORT || 8386;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Đặt thành `true` nếu dùng HTTPS
    })
);
app.use(passport.initialize());
app.use(passport.session());
dbConnect();
initRoutes(app);
cron.schedule('0 0 * * *', () => {
    console.log(
        'Running scheduled task: auto deactivate expired promotions...'
    );
    autoDeactivateExpiredPromotions();
});

// app.use('/' , (req , res) =>  {res.send('SERVER ON')})

app.listen(port, () => {
    console.log(' Server dang chay:' + port);
});
