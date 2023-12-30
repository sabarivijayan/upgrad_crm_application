const User = require("../models/user.model");
const objectConverter = require("../utils/objectConverter");

exports.findAll = async (req, res) => {
  try {
    const userObj = {};

    req.query.userType && (userObj.userType = req.query.userType);
    req.query.userStatus && (userObj.userStatus = req.query.userStatus);

    const users = await User.find(userObj);
    res.status(200).send(objectConverter.userResponse(users));
  } catch (err) {
    console.log(`Error in getting data : ${err}`);
    res.status(404).send({
      message: `Error in getting users`,
    });
  }
};

exports.findById = async (req, res) => {
  try {
    const reqId = req.params.id;

    const user = await User.findOne({ userId: reqId });

    if (user == null)
      return res.status(402).send({
        message: `User with requested userId : ${reqId} doesnot exists`,
      });

    res.status(200).send({
      name: user.name,
      userId: user.userId,
      email: user.email,
      userType: User.userType,
      userStatus: user.userStatus,
    });
  } catch (err) {
    console.log(`Error in getting user data ${err}`);
    res.status(404).send({
      message: `Error in getting user data`,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    /*
        const user = await User.findOne({ userId: req.params.id });
        
        if (user == null) return res.status(404).send({
            message: `User doesnot exists`,
        });
        
        req.body.name && (user.name = req.body.name);
        req.body.userType && (user.userType = req.body.userType);
        req.body.userStatus && (user.userStatus = req.body.userStatus);

        const updatedUser = await user.save();
        */

    // const user = await User.findOneAndUpdate(
    //     { userId: req.params.id },
    //     { $set: { name: req.body.name } },
    //     { $set: { userType: req.body.userType } },
    //     { $set: { userStatus: req.body.userStatus } }
    // )

    const updateData = {
      $set: {
        userStatus: req.body.userStatus,
        name: req.body.name,
        userType: req.body.userType,
      },
    };

    let user = await User.findOneAndUpdate(
      { userId: req.params.id },
      updateData,
      {
        new: true,
      }
    );

    if (user == null)
      return res.status(404).send({
        message: `User doesnot exists`,
      });

    res.status(200).send({
      message: `Updated user data`,
      name: user.name,
      userType: user.userType,
      userStatus: user.userStatus,
    });
  } catch (err) {
    console.log(`Error in updating user : ${err}`);
    res.status(404).send({
      message: `Error in updating user`,
    });
  }
};