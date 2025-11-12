

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_fallback_key'; 

module.exports = function (req, res, next) {
   
    const token = req.header('Authorization');

   
    if (!token || !token.startsWith('Bearer ')) {
     
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }


    const tokenValue = token.split(' ')[1];

    try {
        
        const decoded = jwt.verify(tokenValue, JWT_SECRET);
        
      
        req.user = decoded.user; 
        
        next();
    } catch (e) {
     
        res.status(401).json({ msg: 'Token is not valid' });
    }
};