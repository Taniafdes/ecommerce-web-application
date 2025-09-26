import User from "../model/User.js"

const isAdmin = async (req, res, next) => {
    const user= await User.findById(req.userAuthId) 
    if(user.isAdmin) {
        next()
    }
    else {
        next(new Error('Access Denied Admin Only'))
    }
}

export default isAdmin