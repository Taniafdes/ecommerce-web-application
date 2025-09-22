import jwt from 'jsonwebtoken'

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
        if(err) {
            return "Token Expired";
        }
        else {
            return decoded;
        }
    })

}