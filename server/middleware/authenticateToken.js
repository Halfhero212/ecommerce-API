
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    console.log('Verifying token'); 
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('Received token:', token); 

    if (token == null) {
        console.log('No token provided');
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Error verifying token:', err.message); 
            return res.sendStatus(403); 
        }

        console.log('Token is valid, user:', user); 
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
