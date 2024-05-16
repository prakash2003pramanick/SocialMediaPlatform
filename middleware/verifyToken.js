const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    console.log("VerifyToken middleware is being called");
    
    const token = req.headers.authorization;

    console.log("imported secret : " + JWT_SECRET);
    console.log("received token : " + token);

    if (!token) {
        console.log("Token not provided");
        return res.status(401).send({ status: "ERROR", message: "Unauthorized: Token not provided" });
    }

    jwt.verify(token, JWT_SECRET, { maxAge: '70h' }, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                console.log("Token has expired");
                return res.status(401).send({ status: "ERROR", message: "Unauthorized: Token has expired" });
            } else {
                console.log("Invalid token");
                return res.status(403).send({ status: "ERROR", message: "Forbidden: Invalid token" });
            }
        }
        console.log("Token verified");
        console.log("Decoded email:"+decoded.email);
        console.log("Decoded access:"+decoded.access);
        req.user = decoded;
        next();
    });
};


module.exports = { verifyToken };

