const db = require("../../models/index");
const UserModel = db.users;
const SystemLogModel = db.system_logs;
const bcrypt = require("bcryptjs");

const {
  generateRandomPassword,
} = require("../../helpers/generate-user-password");
const { sendEmail } = require("../../helpers/send-email");

module.exports.checkDuplicateUsernameOrEmail = async (req, res, next) => {
  
  UserModel.findOne({
    where: {
      email: req.body.email,
    },
  }).then((user) => {
    if (user) {
      res.send({
        message: "Failed! Email already exists!",
        error: true,
      });
      return;
    }
    next();
  });
};

module.exports.createUser = async (req, res) => {
  try {
    const { body } = req;
    const password = generateRandomPassword(10);
    body.password = bcrypt.hashSync(password, 8);

    const user = await UserModel.create(body);
    body.password = password;
    await sendEmail(body);
    await SystemLogModel.create({
      title: "New User Added!",
      description:`User ${body?.fullName} has been Created`,
      type:"info"
    });

    return res.status(200).send({ message: "User has been Created" });
  } catch (err) {
    console.log(err.message);
    res.send({ message: err.message, error: true });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    let { body } = req;
    // email should not be a part of the body
    const user = await UserModel.findOne({
      where: { id: req?.params?.id },
    });
    const passwordMatch = bcrypt.compareSync(body.password, user.password);
        
    if (passwordMatch) {
      body.password = bcrypt.hashSync(body.newPassword, 8);
      await UserModel.update(body, {
        where: { id: req?.params?.id },
      });
      res.status(200).send({ message: "Record Successfully Updated" });
      await SystemLogModel.create({
        title: "User Updated!",
        description:`User ${user?.fullName} has been updated`,
        type:"warning"
      });
    } else {
      res.status(406).send({ message: "Wrong Password!"})
    }
  } catch (err) {
    console.log(err.message);
    res.send({ message: err.message, error: true });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      where: { id: req?.params?.id },
      attributes: { exclude: ['password'] } 
    });
    return res.status(200).send(user);
  } catch (err) {
    console.log(err.message);
    res.send({ message: err.message, error: true });
  }
};
module.exports.deleteUser = async (req, res) => {
  try {
    const user = await UserModel.destroy({
      where: { id: req?.params?.id },
    });

    await SystemLogModel.create({
      title: "User Deleted!",
      description:`User ${user?.fullName} has been deleted`,
      type:"error"
    });

    return res
      .status(200)
      .send({ message: "User has been deleted Successfully" });

  } catch (err) {
    console.log(err.message);
    res.send({ message: err.message, error: true });
  }
};

module.exports.listUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll({
      raw: true,
    });

    for (const user of users) {
      delete user.password;
    }

    return res.status(200).send(users);
  } catch (err) {
    console.log(err.message);
    res.send({ message: err.message, error: true });
  }
};
