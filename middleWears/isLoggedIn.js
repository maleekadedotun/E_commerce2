import { getTokenFromHeader } from "../utilis/getTokenFromHeader.js"
import { verifyToken } from "../utilis/verifyToken.js"

export const isLoggedIn = (req, res, next) =>{    
    // get token from header
    const token = getTokenFromHeader(req)
    // verify the user
    const decodedUser = verifyToken(token)
    // save the user into req obj
    if (!decodedUser) {
        throw new Error("Invalid/Expired token please login again")
    }
    else{
        req.userAuthId = decodedUser?.id
        next()
    }
}