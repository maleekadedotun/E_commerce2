export const getTokenFromHeader = (req) => {
    // get token from header
    const token = req?.headers?.authorization?.split(" ")[1]
    // console.log(token, "header");
    
    if (!token) {
        return false;
    }
    else{
        return (token)
    }
}

