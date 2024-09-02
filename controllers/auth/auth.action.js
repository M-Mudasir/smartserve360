const db = require("../../models/index");
const UserModel = db.users;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../../config/auth.config");
const SystemLogModel = db.system_logs;

//middlewares

module.exports.checkDuplicateUsernameOrEmail = async (req, res, next) => {
  // Username
  UserModel.findOne({
    where: {
      email: req.body.email,
    },
  }).then((user) => {
    if (user) {
      res.status(409).send({
        message: "Failed! Email Already Exists!",
      });
      return;
    }
    next();
  });
};

//Signup Login

module.exports.signup = async (req, res) => {
  try {
    const { body } = req;
    body.password = bcrypt.hashSync(req.body.password, 8);
    body.companyId = 1;
    body.role= "staff";
    await UserModel.create(body);
    await SystemLogModel.create({
      title: "New User Added!",
      description:`User ${body?.fullName} Signed Up`,
      type:"info"
    });
    res.status(200).send({ message: "USER REGISTERED" });
  } catch {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
};

module.exports.signin = async (req, res) => {
  try {
    let user = await UserModel.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.send({ message: "User Not found.", error: true });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.send({
        accessToken: null,
        message: "Invalid Password!",
        error: true,
      });
    }
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 1.577e8, // 24 hours
    });

    delete user.password;

    // Set token in cookies
    res.cookie('accessToken', token, { maxAge: 86400000})

    res.status(200).send({
      user,
      message: "Successfully logged in",
    });
  } catch (error) {
    res.send({ message: error.message, error: true });
  }
};

module.exports.changePassword = async (req, res) => {
  try {
    let user = await UserModel.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.currentPassword,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    await UserModel.update(
      {
        password: bcrypt.hashSync(req.body.newPassword, 8),
      },
      {
        where: { id: user?.id },
      }
    );
    return res.status(200).send({ message: "Password Updated" });
  } catch {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
};
