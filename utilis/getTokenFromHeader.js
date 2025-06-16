export const getTokenFromHeader = (req) => {
    // get token from header
    const token = req?.headers?.authorization?.split(" ")[1]
    if (!token) {
        return false;
    }
    else{
        return (token)
    }
}