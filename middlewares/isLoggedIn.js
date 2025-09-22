import { getTokenFromHeader } from "../utils/getTokenFromHeader.js"
import { verifyToken } from "../utils/verifyToken.js"

export const isLoggedIn = (req, res, next) => {
    
    // get the token
    const token = getTokenFromHeader(req)
    // verify the token
    const verify = verifyToken(token)
    if(!verify) {
        throw new Error('Invalid token')
    }
    else {
        req.userAuthId = verify?.id
        next();
    }
}