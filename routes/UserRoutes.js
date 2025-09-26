import express from 'express';
import { loginUserCtrl, registerUserCtrl, getProfileCtrl, updateShippingAddressCtrl } from '../controllers/UsersCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const userRoutes = express.Router()

userRoutes.post('/users/register', registerUserCtrl)

userRoutes.post('/users/login', loginUserCtrl)

userRoutes.get('/users/profile', isLoggedIn, getProfileCtrl)

userRoutes.put('/users/update/shipping', isLoggedIn, updateShippingAddressCtrl)
export default userRoutes