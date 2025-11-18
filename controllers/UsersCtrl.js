import asyncHandler from "express-async-handler";
import User from "../model/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

// @desc Register user
// @route POST /api/v1/users/register
// @access private/admin

export const registerUserCtrl = asyncHandler(
     async (req, res) => {
        console.log("📥 Register Body:", req.body);
    
    const { fullname, email, password} = req.body;
    const userExists = await User.findOne({ email })

    // check user
    if(userExists) {
        throw new Error("User already exists")
    }

    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt);

    // create  user

    const createUser = await User.create({
        fullname,
        email,
        password: hashedPassword,
        // isAdmin: req.body.isAdmin || false,
    });
    res.status(201).json({
        status: "success",
        message: "User Registered Successfully",
        msg: createUser,
    });

}
);


// @desc login user
// @route POST /api/v1/users/login
// @access private/admin

export const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const checkEmail = await User.findOne({ email });

    if (checkEmail && await bcrypt.compare(password, checkEmail.password)) {
        res.status(200).json({
            status: "success",
            message: "User Logged in successfully",
            user: checkEmail,
            token: generateToken(checkEmail._id),
        });
    } else {
        res.status(401).json({
            status: "error",
            message: "Invalid email or password"
        });
    }
});


// @desc get user
// @route get /api/v1/users/profile
// @access private

export const getProfileCtrl = asyncHandler(async (req, res) => {
    const profile = await User.findById(req.userAuthId).populate("orders");
    res.json({
        status: 'success',
        message: "User profile fetched successfully",
        profile
    })

})

// update shipping address
export const updateShippingAddressCtrl = asyncHandler(async(req, res)=> {
const {firstName, lastName, address, postalCode, city, province, phone} = req.body;
const user = await User.findByIdAndUpdate(req.userAuthId, {
shippingAddress: {firstName, 
    lastName, 
    address, 
    postalCode, 
    city, 
    province, 
    phone
},
hasShippingAddress: true,
},
{
    new: true
});
res.json({
    status: "success",
    message: "User shipping updated successfully",
    user,
});
})