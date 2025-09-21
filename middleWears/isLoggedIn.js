import { getTokenFromHeader } from "../utilis/getTokenFromHeader.js"
import { verifyToken } from "../utilis/verifyToken.js"

export const isLoggedIn = (req, res, next) =>{    
    // get token from header
    const token = getTokenFromHeader(req)
    // console.log(token, "token");
    
    // verify the user
    const decodedUser = verifyToken(token)
    // save the user into req obj
    // console.log("Decoded token:", decodedUser)
    if (!decodedUser) {
        throw new Error("Invalid/Expired token please login again")
    }
    else{
        req.userAuthId = decodedUser?.id
        next()
    }
}

// export const isLoggedIn = (req, res, next) => {
//   const token = getTokenFromHeader(req);
//   if (!token) return res.status(401).json({ message: "No token provided" });

//   const decodedUser = verifyToken(token);
//   if (!decodedUser || decodedUser === "Token expired/invalid") {
//     return res.status(401).json({ message: "Invalid/Expired token" });
//   }

//   req.userAuthId = decodedUser.id;
//   next();
// };
