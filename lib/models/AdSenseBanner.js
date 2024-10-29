// /lib/models/AdSenseBanner.js
const mongoose = require('mongoose');

const AdSenseBannerSchema = new mongoose.Schema({
    ad_code: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Check if the model is already defined to avoid OverwriteModelError
const AdSenseBannerModel = mongoose.models.AdSenseBanner || mongoose.model('AdSenseBanner', AdSenseBannerSchema);

module.exports = AdSenseBannerModel;
