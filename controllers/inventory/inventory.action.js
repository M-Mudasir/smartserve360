const db = require("../../models/index");
const dayjs = require('dayjs');
const {Sequelize} =  require("sequelize");
const InventoryModel = db.inventories;
const SystemLogModel = db.system_logs;
const AutomationModel = db.automations;


module.exports.createInventory = async (req, res) => {
  try {
    const { body } = req;
    if (body.expiryDate && body.purchaseDate) {
      const purchaseDate = dayjs(body.purchaseDate, 'DD/MM/YYYY'); // Assuming date format is 'DD/MM/YYYY'
      const expiryDate = dayjs(body.expiryDate, 'DD/MM/YYYY'); // Assuming date format is 'DD/MM/YYYY'

      // Check if the expiry date is greater than the purchase date
      if (expiryDate <= purchaseDate) {
        return res.send({ message: "Expiry date should be greater than the purchase date.", error: true });
      }
    }

    const item = await InventoryModel.create({...body, totalQuantity:body.quantity, remainingQuantity:body.quantity});

    await SystemLogModel.create({
      title: "New Inventory Added!",
      description:`Inventory ${body?.title} has been created`,
      type:"info"
    });

    if(body.automation){
      await AutomationModel.create({
        inventoryId:item.id,
        automated_quantity:body.automated_quantity,
        interval:body.interval,
        expiryInDays:body.expiryInDays
      })
    }
    return res.status(200).send({ message: "Inventory has been Created" });
  } catch (err) {
    console.log(err.message);
    res.send({ message: err.message, error: true });
  }
};

module.exports.updateInventory = async (req, res) => {
  try {
    const { body } = req;

    await InventoryModel.update({
      totalQuantity: Sequelize.literal(`totalQuantity + ${body.quantity}`),
      quantity: body.quantity,
      remainingQuantity: Sequelize.literal(`remainingQuantity + ${body.quantity}`),
      expiryDate: body.expiryDate,
      automation:body.automation
    }, {
      where: { id: req?.params?.id },
    });

    if(body.automation){
      await AutomationModel.update({
        automated_quantity:body.automated_quantity,
        interval:body.interval,
        expiryInDays:body.expiryInDays
      }, {
        where: { inventoryId: req?.params?.id },
      })
    }    

    await SystemLogModel.create({
      title: "Inventory Updated!",
      description:`Inventory ${body?.title} has been updated`,
      type:"warning"
    });

    return res.status(200).send({ message: "Inventory has been Updated" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
};

module.exports.getInventory = async (req, res) => {
  try {
    const item = await InventoryModel.findOne({
      where: { id: req?.params?.id },
    });

    if(item.automation){
      const automation = await AutomationModel.findOne({
      where: { inventoryId: req?.params?.id },
    });
    const automatedItem = {...automation.dataValues, ...item.dataValues}
    return res.status(200).send(automatedItem);
    }
    else{
      return res.status(200).send(item);
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
};
module.exports.deleteInventory = async (req, res) => {
  try {
    const item = await InventoryModel.findOne({
      where: { id: req?.params?.id },
      raw: true,
    });

    await InventoryModel.destroy({
      where: { id: req?.params?.id },
    });

    await AutomationModel.destroy({
      where: { inventoryId: req?.params?.id },
    });

    await SystemLogModel.create({
      title: "Inventory Deleted!",
      description:`Inventory ${item?.title} has been deleted`,
      type:"error"
    });
    return res
      .status(200)
      .send({ message: "Inventory Item has been deleted Successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
};

module.exports.listInventory = async (req, res) => {
  try {
    const list = await InventoryModel.findAll({
      raw: true,
    });

    return res.status(200).send(list);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
};
