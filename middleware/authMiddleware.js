const jwt = require("jsonwebtoken");


const protected = (req,res,next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "No token provided" });
    const tokenWithoutBearer = token.split(" ")[1];
    try {
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = protected ;