import { getTokenFromHeader } from "../utils/getTokenFromHeader.js"
import { verifyToken } from "../utils/verifyToken.js"

export const isLoggedIn = (req, res, next) => {
  const token = getTokenFromHeader(req);

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const verified = verifyToken(token);

  if (!verified) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  req.userAuthId = verified.id;
  next();
};
