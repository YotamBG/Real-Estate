const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

/**
 * @swagger
 * /cart/create-checkout-session:
 *   post:
 *     tags:
 *       - Cart
 *     description: Sends a user's cart to stripe
 *     produces:
 *       - application/json
 *     responses:
 *       400:
 *         description: Cart empty
 *       200:
 *         description: Stripe checkput URL
 */
router.post("/create-checkout-session", async (req, res) => {
    const items = [{ 'product_id': 1, 'name': 'Insurance', 'price': 500, 'quantity': 1 }];  //example
    const storeItems = new Map(items.map(item => ([item.product_id, { 'name': item.name, 'price': item.price, 'quantity': item.quantity, }])));
    console.log('storeItems:');
    console.dir(storeItems);

    try {
        console.log('creating stripe session!');
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: items.map(item => {
                const storeItem = storeItems.get(item.product_id)
                return {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: storeItem.name,
                            metadata: { 'appId': req.body.appId }
                        },
                        unit_amount: storeItem.price * 100
                    },
                    quantity: item.quantity,
                }
            }),
            success_url: `${process.env.SERVER_URL}/cart/complete-checkout-session?session_id={CHECKOUT_SESSION_ID}&appId=${req.body.appId}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel.html`, // redirect to client payment failure page
        })
        res.json({ url: session.url })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})


/**
 * @swagger
 * /cart/complete-checkout-session:
 *   post:
 *     tags:
 *       - Cart
 *     description: Recives checkout confiramtion from stripe
 *     produces:
 *       - application/json
 *     responses:
 *       400:
 *         description: Cart empty
 *       200:
 *         description: Ordered
 */
router.get('/complete-checkout-session', async (req, res, next) => {
    //check with stripe
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    console.log('stripe session:');
    console.dir(session);
    res.redirect(`${process.env.CLIENT_URL}/Real-Estate/applicationDetails/${req.query.appId}`); //onlhy for localDEV!
});

module.exports = router;