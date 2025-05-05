const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    ip: String,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Visit || mongoose.model('Visit', visitSchema);
