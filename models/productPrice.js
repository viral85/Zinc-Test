const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductPriceSchema = new Schema(
    {
        seller: {
            id: {
                type: String,
                trim: true,
                required: true,
                index: true
            },
            name: {
                type: String,
                trim: true,
                required: true,
                index: true
            },
            num_ratings:{
                type: String,
                trim: true,
                required: true,
                index: true
            },
            percent_positive:{
                type: String,
                trim: true,
                required: true,
                index: true
            },
            first_party:{
                type: String,
                trim: true,
                required: true,
                index: true
            }
        },
        currency: {
            type: String,
            trim: true
        },
        available: {
            type: Boolean
        },
        offer_id: {
            type: String,
            trim: true
        },
        asin: {
            type: String,
            trim: true
        },
        price: {
            type: Number,
            required: true
        },
        comments: {
            type: String,
        }
    },
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        },
    }
);

module.exports = mongoose.model('ProductPrice', ProductPriceSchema);