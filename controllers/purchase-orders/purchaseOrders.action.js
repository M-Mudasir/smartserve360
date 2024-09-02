const db = require("../../models/index");
const PurchaseOrderModel = db.purchase_orders;


module.exports.createPurchaseOrder = async (req, res) => {
  try {
    const { body } = req;

    await PurchaseOrderModel.create(body);

    return res.status(200).send({ message: "Procurement Request has been Created" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
};

module.exports.getPurchaseOrder = async (req, res) => {
  try {
    const menuItem = await PurchaseOrderModel.findOne({
      where: { id: req?.params?.id },
    });

    return res.status(200).send(menuItem);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
};
module.exports.deletePurchaseOrder = async (req, res) => {
  try {
    await PurchaseOrderModel.destroy({
      where: { id: req?.params?.id },
    });

    return res
      .status(200)
      .send({ message: "PurchaseOrder have been deleted Successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
};

module.exports.listPurchaseOrders = async (req, res) => {
  try {
    const list = await PurchaseOrderModel.findAll({
      raw: true,
    });

    return res.status(200).send(list);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
};
