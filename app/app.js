import express from 'express';
import dbConnect from '../config/dbConnect.js';
import userRoutes from '../routes/UserRoutes.js';
import { globalErrHandler, notFound } from '../middlewares/globalErrHandler.js';
import productRoutes from '../routes/ProductRoutes.js';
import categoriesRoutes from '../routes/CategoriesRoutes.js';
import brandRoutes from '../routes/BrandsRoutes.js';
import colorRoutes from '../routes/ColorsRoutes.js';
import reviewRoutes from '../routes/ReviewRouter.js';
import OrderRouter from '../routes/OrderRouter.js';
import Stripe from "stripe";
import Order from '../model/Order.js';
import couponRoutes from '../routes/CouponRoutes.js';

// db connect
dbConnect()
const app = express()

// Stripe
const stripe = new Stripe(process.env.STRIPE_KEY)
// NOTE: For security, use environment variables for secrets like endpointSecret.
// This hardcoded value 'whsec_b39c9fd40a75b4d838c1f44c9ddc514f5d085f89b0bd50fc15c7a65ad665ea79' 
// should ideally be replaced with process.env.STRIPE_WEBHOOK_SECRET
const endpointSecret = 'whsec_b39c9fd40a75b4d838c1f44c9ddc514f5d085f89b0bd50fc15c7a65ad665ea79';

app.post('/webhook', express.raw({type: 'application/json'}), async(request, response) => {
  let event;
  if (endpointSecret) {
    const signature = request.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        endpointSecret
      );
      
      console.log('event', event)
    } catch (err) {
      console.log(`Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }

  
    if(event=== 'checkout.session.completed') {
      const session = event.data.object;
      const { orderId } =session.metadata;
      const paymentStatus = session.payment_status;
      const paymentMethod = session.payment_method_type[0];
      const totalAmount = session.amount_total;
      const currency = session.currency;
      console.log({
        orderId,
        paymentStatus,
        paymentMethod,
        totalAmount,
        currency
      })
      const order = await Order.findByIdAndUpdate(JSON.parse(orderId), {
        totalPrice: totalAmount / 100,
        currency,
        paymentMethod,
        paymentStatus
      }, {
        new: true,
      });
      console.log(order)
    } 
    else {
      // If the event is received but not the one we want, return a 200 OK
      return response.json({received: true});
    }
  
    response.json({received: true});
  }
}
)

// pass incoming data
app.use(express.json());

// 🚩 FIX: CONSOLIDATE ALL ROUTE MOUNTING TO THE BASE PREFIX /api/v1 
// This ensures that each router file must specify its resource path (e.g., '/users', '/products')
app.use('/api/v1', userRoutes)
app.use('/api/v1', productRoutes) // Cleaned up from /api/v1/
app.use('/api/v1', categoriesRoutes)
app.use('/api/v1', brandRoutes)
app.use('/api/v1', colorRoutes)
app.use('/api/v1', reviewRoutes)
app.use('/api/v1', OrderRouter)
app.use('/api/v1', couponRoutes)


// err middleware
app.use(notFound)
app.use(globalErrHandler)


export default app
