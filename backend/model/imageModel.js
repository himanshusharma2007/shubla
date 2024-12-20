const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
    image: {
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    alt: {
        type: String,
        trim: true
    }
}, { timestamps: true });

const instagramImageSchema = new mongoose.Schema({
    image: {
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    alt: {
        type: String,
        trim: true
    },
    link: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

const GalleryImage = mongoose.model('GalleryImage', galleryImageSchema);
const InstagramImage = mongoose.model('InstagramImage', instagramImageSchema);

module.exports = { GalleryImage, InstagramImage };