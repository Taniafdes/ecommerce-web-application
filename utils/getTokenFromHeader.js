export const getTokenFromHeader = (req) => {
    const token = req?.headers?.authorization.split(" ")[1];
    if(token === undefined) {
        return 'No token has been found'
    } else {
        return token
    }
}