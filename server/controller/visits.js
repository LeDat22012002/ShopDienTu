const Visit = require('../models/visit');
const asyncHandeler = require('express-async-handler');

const createVisit = asyncHandeler(async (req, res) => {
    await Visit.create({ ip: req.ip });
    res.status(200).json({ success: true });
});

module.exports = {
    createVisit,
};
