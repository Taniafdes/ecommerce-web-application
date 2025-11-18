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
import cors from 'cors';
// db connect
dbConnect()
const app = express()

app.use(cors());

// Stripe
const stripe = new Stripe(process.env.STRIPE_KEY)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;;

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
      return
    }

  response.json({received: true});
}
}
)

// pass incoming data
app.use(express.json());



// routes
// app.use('/api/v1/users', userRoutes)
// app.use('/api/v1/products', productRoutes)
// app.use('/api/v1/categories', categoriesRoutes)
// app.use('/api/v1/brands', brandRoutes)
// app.use('/api/v1/colors', colorRoutes)
// app.use('/api/v1/reviews', reviewRoutes)
// app.use('/api/v1/orders', OrderRouter)
// app.use('/api/v1/coupons', couponRoutes)

app.use('/api/v1/users', userRoutes)
app.use('/api/v1', productRoutes)
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