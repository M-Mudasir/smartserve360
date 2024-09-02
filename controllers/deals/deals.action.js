const db = require("../../models/index");
const SystemLogModel = db.system_logs;
const DealModel = db.deals;

module.exports.createDeal = async (req, res) => {
  try {
    const { body } = req;

    await DealModel.create(body);

    await SystemLogModel.create({
      title: "New Deal Added!",
      description: `Deal ${body?.title} has been created`,
      type:"info"
    });

    return res.status(200).send({ message: "Deal has been Created" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
};

module.exports.getDeal = async (req, res) => {
  try {
    const item = await DealModel.findOne({
      where: { id: req?.params?.id },
    });

    return res.status(200).send(item);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
};
module.exports.deleteDeal = async (req, res) => {
  try {
    const deal = await DealModel.findOne({
      where: { id: req?.params?.id },
      raw: true,
    });
    await DealModel.destroy({
      where: { id: req?.params?.id },
    });

    await SystemLogModel.create({
      title: "Deal Deleted!",
      description: `Deal ${deal?.title} has been deleted`,
      type:"error"
    });

    return res
      .status(200)
      .send({ message: "Deal has been deleted Successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
};

module.exports.listDeals = async (req, res) => {
  try {
    const list = await DealModel.findAll({
      raw: true,
    });
    return res.status(200).send(list);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message, error: true })
  }
};

module.exports.updateDeal = async (req, res) => {
  try {
    const { body } = req;
    const deal = await DealModel.findOne({
      where: { id: req.params.id },
      raw: true
    })

    await DealModel.update(body, {
      where: { id: req?.params?.id },
    });

    await SystemLogModel.create({
      title: "Deal Updated!",
      description:`Deal ${deal?.title} has been updated`,
      type:"warning"
    });

    return res.status(200).send({ message: "Deal has been Updated" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
};
