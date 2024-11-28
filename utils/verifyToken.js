import jwt from 'jsonwebtoken';

const VerifyUserToken = async (req, res, next) => {
    const { user_token } = req.cookies;

    // Check if the user_token exists in cookies
    if (!user_token) {
        return res.status(401).json({ msg: "Unauthorized, user token not found" });
    }

    try {
        // Verify the user_token with the secret
        const token = jwt.verify(user_token, process.env.JWT_SECRET);

        // If the token is invalid or expired, jwt.verify will throw an error
        if (!token) {
            return res.status(401).json({ msg: "Unauthorized, invalid token" });
        }

        // Attach the user ID from the token to the request object
        req.userId = token.id;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // If jwt.verify fails (e.g., expired or invalid token), send an error response
        return res.status(401).json({ msg: "Unauthorized, invalid token", error: error.message });
    }
};

export default VerifyUserToken;
