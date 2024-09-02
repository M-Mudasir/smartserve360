const db = require("../../models/index");
const vendorModel = db.vendors;
const SystemLogModel = db.system_logs;


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

module.exports.createVendor = async (req, res) => {
  try {
    const { body } = req;

    await vendorModel.create(body)

    await SystemLogModel.create({
      title: "New Vendor Added!",
      description:`Vendor ${body?.name} has been created`,
      type:"info"
    });

    return res.status(200).send({ message: "Vendor Created Successfully" });
  } catch (err) {
    console.log(err.message);
    res.send({ message: err.message, error: true });
  }
};


module.exports.listVendors = async (req, res) => {
  try {
    const vendors = await vendorModel.findAll({
      raw: true,
    });

    return res.status(200).send(vendors);
  } catch (err) {
    console.log(err.message);
    res.send({ message: err.message, error: true });
  }
};

module.exports.getOneVendor = async (req, res) => {
  try {
    const vendor = await vendorModel.findOne({
      where: { id: req?.params?.id},
      raw: true,
    });

    return res.status(200).send(vendor);
  } catch (err) {
    console.log(err.message);
    res.send({ message: err.message, error: true });
  }
};

module.exports.updateVendor = async (req, res) => {
  try {
    const { body } = req;
    const vendor = await vendorModel.findOne({
      where: { id: req?.params?.id},
      raw: true,
    });

    await vendorModel.update(body, {
      where: { id: req?.params?.id },
    });

    await SystemLogModel.create({
      title: "Vendor Updated!",
      description:`Vendor ${vendor?.name} has been updated`,
      type:"warning"
    });

    return res.status(200).send({ "message": "Vendor Updated Successfully!" });
  } catch (err) {
    console.log(err.message);
    res.send({ message: err.message, error: true });
  }
};
