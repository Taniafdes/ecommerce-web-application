import express from 'express';
import dbConnect from './config/dbConnect.js';
import { globalErrHandler, notFound } from './middlewares/globalErrHandler.js';
// Route Imports
import userRoutes from './routes/UserRoutes.js';
import productRoutes from './routes/ProductRoutes.js';
import categoriesRoutes from './routes/CategoriesRoutes.js';
import brandRoutes from './routes/BrandsRoutes.js';
import colorRoutes from '../routes/ColorsRoutes.js';
import reviewRoutes from '../routes/ReviewRouter.js';
import OrderRouter from '../routes/OrderRouter.js';
import couponRoutes from '../routes/CouponRoutes.js';
// Model and Utility Imports
import Order from './model/Order.js'; 
import Stripe from "stripe";

// --- Database Connection ---
// This function must be robust and handle connection failures gracefully
dbConnect();

const app = express();

// --- Stripe Setup ---
// CRITICAL: Initialize Stripe using the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_KEY);

// CRITICAL SECURITY FIX: Load the Webhook Secret from environment variables
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; 

// =========================================================================
// STRIPE WEBHOOK ROUTE (MUST BE PLACED BEFORE express.json()!)
// =========================================================================
// We use express.raw() here to get the raw request body buffer, 
// which is required by stripe.webhooks.constructEvent for signature verification.
app.post('/webhook', express.raw({type: 'application/json'}), async(request, response) => {
    let event;

    // Optional safety check for environment variable configuration
    if (!endpointSecret) {
        console.error("SERVER ERROR: STRIPE_WEBHOOK_SECRET environment variable is not configured.");
        return response.sendStatus(500); 
    }
    
    const signature = request.headers['stripe-signature'];
    
    try {
        event = stripe.webhooks.constructEvent(
            request.body, // raw buffer
            signature,
            endpointSecret
        );
        
    } catch (err) {
        console.log(`❌ Webhook signature verification failed: ${err.message}`);
        return response.sendStatus(400); // Return 400 immediately on verification failure
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        try {
            const { orderId } = session.metadata;
            const paymentStatus = session.payment_status;
            // payment_method_types is an array, take the first one
            const paymentMethod = session.payment_method_types ? session.payment_method_types[0] : 'card'; 
            const totalAmount = session.amount_total; // in cents
            const currency = session.currency;

            console.log(`✅ Checkout Session Completed! Order ID: ${orderId}`);

            // Update the order in the database
            const order = await Order.findByIdAndUpdate(orderId, {
                totalPrice: totalAmount / 100, // Convert cents back to base currency
                currency,
                paymentMethod,
                paymentStatus,
                isPaid: true, 
            }, { new: true });

            console.log('Order successfully updated:', order);

        } catch (dbUpdateError) {
            console.error('Error updating order in database after successful payment:', dbUpdateError);
            // Must return 200 OK to Stripe even if DB update failed, so Stripe doesn't retry
            return response.status(200).json({ received: true, db_error: true }); 
        }
    } 
    
    // Return a 200 response to Stripe to acknowledge receipt of the event
    response.status(200).json({ received: true });
});

// =========================================================================
// MIDDLEWARE (General)
// =========================================================================

// This must come AFTER the Stripe webhook. It parses all other incoming JSON bodies.
app.use(express.json()); 

// --- Standard Routes ---
// Use app.use('/api/v1', route) if all routes in the router start with a path segment
app.use('/api/v1', userRoutes)
app.use('/api/v1', productRoutes)
app.use('/api/v1', categoriesRoutes)
app.use('/api/v1', brandRoutes)
app.use('/api/v1', colorRoutes)
app.use('/api/v1', reviewRoutes)
app.use('/api/v1', OrderRouter)
app.use('/api/v1', couponRoutes)

// --- Error Handling Middleware ---
app.use(notFound)
app.use(globalErrHandler)


export default app;