const express = require('express');
const bodyParser = require('body-parser');
const zincApi = require('./modules/zinc-api')('B9DD68C645191A9DD0E57556');
const productPrice = require('./models/productPrice');
const app = express();

require('./config/db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) =>
{
    zincApi.processRequest(
        'GET',
        `/v1/products/B00FE2N1WS/offers?retailer=amazon`,
        {},
        (err, data) =>
        {
            if(err) { return res.json(data); }
            if(data.offers) {
                data.offers.forEach(async (offer) => {
                    await productPrice.findOneAndUpdate({
                        'seller.id': offer.seller.id,
                        'seller.name': offer.seller.name
                    },
                    {
                        $set: {
                            seller: {
                                id: offer.seller.id,
                                name: offer.seller.name,
                                num_ratings: offer.seller.num_ratings,
                                percent_positive: offer.seller.percent_positive,
                                first_party: offer.seller.first_party
                            },
                            currency: offer.currency,
                            available: offer.available,
                            offer_id: offer.offer_id,
                            asin: offer.asin,
                            price: offer.price,
                            comments: offer.comments
                        }
                    }, {
                        upsert: true
                    });
                });
            }
            return res.send("Data mapped to DB.");
        }
    );
});

/**
 * We can set PORT and all dynamic and based on environment
 * but keep it short for test work
 */

app.listen(4000, () => {
    console.log('Example app listening on port 4000!');
});