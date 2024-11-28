import jwt from 'jsonwebtoken';

const VerifyRole = async (req, res, next) => {
    const { role_token } = req.cookies;

    // Check if the role_token exists in cookies
    if (!role_token) {
        return res.status(401).json({ msg: "Unauthorized, role token not found" });
    }

    try {
        // Verify the role_token with the secret
        const token = jwt.verify(role_token, process.env.JWT_SECRET);

        // If the token is invalid or expired, jwt.verify will throw an error
        if (!token) {
            return res.status(401).json({ msg: "Unauthorized, invalid token" });
        }

        // Attach the role from the token to the request object
        req.role = token.role;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // If jwt.verify fails (e.g., expired or invalid token), send an error response
        return res.status(401).json({ msg: "Unauthorized, invalid token", error: error.message });
    }
};

export default VerifyRole;
