const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.json({ success: false, message: "Not Authorized! Login to continue.." });
    }

    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if(decodedToken.id){
            req.userId = decodedToken.id;
        }
        else{ 
            return res.json({ success: false, message: "Not Authorized! Login to continue.." });
        }

        next();

    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
}

module.exports = userAuth;