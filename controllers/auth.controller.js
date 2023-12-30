const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const constants = require('../utils/constants');
const jwt = require('jsonwebtoken');
const secretKey = require('../configs/auth.config');

exports.signup = async (req, res) => {
    try {
      const hashPassword = bcrypt.hashSync(req.body.password, 8);

      var userStatus = req.body.userStatus;

      if (!userStatus) {
        if (req.body.userType == constants.userTypes.customer) {
          userStatus = constants.userStatus.approved;
        } else {
          userStatus = constants.userStatus.pending;
        }
      }
      const userObj = {
        name: req.body.name,
        userId: req.body.userId,
        email: req.body.email,
        password: hashPassword,
        userType: req.body.userType,
        userStatus: userStatus,
      };

      const userCreated = await User.create(userObj);
      const postResponse = {
        name: userCreated.name,
        userId: userCreated.userId,
        email: userCreated.email,
        userType: userCreated.userType,
        userStatus: userCreated.userStatus,
        createdAt: userCreated.createdAt,
        updatedAt: userCreated.updatedAt,
      };
      res.status(201).send(postResponse);
    } catch (err) {
      console.log(`Error while inserting user ${err}`);
      res.status(500).send({
        message: `Some internal error while registration`,
      });
    }
}

exports.signin = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.body.userId });
    
        if (user === null) return res.status(401).send({
            message: `UserId : ${req.body.userId}, doesn't exists`
        })

        if (user.userStatus !== constants.userStatus.approved) return res.status(200).send({
            message: `Can't login with ${user.userStatus} status`
        })

        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).send({
                message: `Invalid password`
            });
        } else {
            const token = jwt.sign({ id: user.userId }, secretKey.secret, { expiresIn: 5000 });
            let userRequested = {
                name: user.name,
                email: user.email,
                userId: user.userId,
                userType: user.userType,
                userStatus: user.userStatus,
                accessToken: token
            };
            return res.status(200).send({ userRequested });
        }
    } catch (err) {
        console.log(`Error while signing in. Error is ${err}`);
        res.status(404).send({
            message: `Error is signing in`
        })
    }
}