const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const userdata = (req, res, next) => {
    const token = req.header("auth-token");
    if(!token){
        res.status(401).json({error: "access Denied"});
    }
    const verify = jwt.verify(token, SECRET_KEY);
    req.token = verify.user;
    next();
}

module.exports = userdata;