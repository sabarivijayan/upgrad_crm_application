const jwt = require('jsonwebtoken');
const secretKey = require('../configs/auth.config');
const User = require('../models/user.model');
const constants = require('../utils/constants');

verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];

    if(!token) return res.status(403).send({
        message: `No token provided`
    });

    jwt.verify(token, secretKey.secret, (err, payload) => {
        if(err) {
            return res.status(401).send({
                message: `Not authorized!`
            });
        } 

        req.userId = payload.id;
        next();
    });

};

isAdmin = async (req, res, next) => {
    const user = await User.findOne({ userId: req.userId });
    
    if (user && user.userType === constants.userTypes.admin) {
        next();
    } else {
        res.status(403).send({
            message: `Not authorized`
        });
    }
}

isAdminOrOwner = async (req, res, next) => {
    const user = await User.findOne({ userId: req.userId });
    
    if (user.userType === 'admin' || user.userId === req.params.id) {
        if (req.body.userStatus && user.userType !== 'admin') {
            return res.status(402).send({
                message: `Not authorized`
            });
        }
        next();
    } else {
        res.status(403).send({
            message: `Only admin or user is allowed`
        });
    }
} 

const authFunction = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isAdminOrOwner: isAdminOrOwner
}

module.exports = authFunction;