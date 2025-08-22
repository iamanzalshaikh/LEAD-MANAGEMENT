import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try {
        let { token } = req.cookies;
        if (!token) {
            return res.status(400).json({ message: "User doesnt have token" });
        }

        let verifyToken = await jwt.verify(token, process.env.JWT_SECRET);

        if (!verifyToken) {
            return res.status(400).json({ message: "user doesn't have valid token" });
        }

        req.userId = verifyToken.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: `Authentication failed ${error}` });
    }
};

export default isAuth;
