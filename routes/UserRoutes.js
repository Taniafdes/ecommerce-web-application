import express from 'express';
import { loginUserCtrl, registerUserCtrl, getProfileCtrl, updateShippingAddressCtrl } from '../controllers/UsersCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const userRoutes = express.Router()

userRoutes.post('/register', registerUserCtrl)

userRoutes.post('/login', loginUserCtrl)

userRoutes.get('/profile', isLoggedIn, getProfileCtrl)

userRoutes.put('/update/shipping', isLoggedIn, updateShippingAddressCtrl)
export default userRoutes