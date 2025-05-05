const userRouter = require('./user');
const productRouter = require('./product');
const productCategoryRouter = require('./productCategory');
const blogCategoryRouter = require('./blogCategory');
const blogRouter = require('./blog');
const brandRouter = require('./brand');
const couponRouter = require('./coupon');
const orderRouter = require('./order');
const colorRouter = require('./color');
const promotionRouter = require('./promotion');
const flashSaleRouter = require('./flashSale');
const paymentRouter = require('./payment');
const paymentVNpayRouter = require('./paymentVNpay');
const paymentZalopayRouter = require('./paymentZalopay');
const dashboardRouter = require('./dashboard');
const visitRouter = require('./visit');

const { notFound, errHandle } = require('../middlewares/errorHandler');

const initRoutes = (app) => {
    app.use('/api/user', userRouter);
    app.use('/api/product', productRouter);
    app.use('/api/category', productCategoryRouter);
    app.use('/api/blogcategory', blogCategoryRouter);
    app.use('/api/blog', blogRouter);
    app.use('/api/brand', brandRouter);
    app.use('/api/coupon', couponRouter);
    app.use('/api/order', orderRouter);
    app.use('/api/color', colorRouter);
    app.use('/api/promotion', promotionRouter);
    app.use('/api/flashsale', flashSaleRouter);
    app.use('/api/dashboard', dashboardRouter);
    app.use('/api/visit', visitRouter);
    app.use('/api/payment', paymentRouter);
    app.use('/api/paymentVNpay', paymentVNpayRouter);
    app.use('/api/paymentZalopay', paymentZalopayRouter);

    app.use(notFound);
    app.use(errHandle);
};

module.exports = initRoutes;
