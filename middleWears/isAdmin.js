import User from "../models/User.js"

const isAdmin = async(req, res, next) => {
    // find the login user
    const user = await User.findById(req.userAuthId);
    // console.log("working",user);
     if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
        
    // check if isAdmin
    if (user.isAdmin) {
      next()
    }
    else{
      next(new Error("Access denied, admin only"));
    }
};

export default isAdmin;