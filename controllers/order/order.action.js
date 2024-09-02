const db = require("../../models/index");
const OrderModel = db.orders;
const {Sequelize} =  require("sequelize");
const inventoryModel = db.inventories;

module.exports.createOrder = async (req, res) => {
  try {
    const { body } = req;
    const orderBody = {
      customerName: body.customerName,
      contactInfo: body.contactInfo,
      amount: body.amount,
      type: body.type,
      status: body.status,
      menuItems :body.menuItems
    }

    const item = await OrderModel.create(orderBody);

    const menuItems = item.menuItems

    for (let i=0; i < menuItems.length; i++){

      const ingredients = JSON.parse(menuItems[i].ingredient)
      // const parsedIngredients = JSON.parse(ingredients)
      const quantity = menuItems[i].quantity

      for (let j=0; j < ingredients.length; j++){
        await inventoryModel.update(
          { remainingQuantity: 
          Sequelize.literal(`remainingQuantity - ${(typeof ingredients[j].quantity === "string" ?
           parseInt(ingredients[j].quantity):ingredients[j].quantity) * quantity}`) },
          {
            where: {
              id: parseInt(ingredients[j].inventoryId),
            }
          }
        );
      }
    } 
    
    return res.status(200).send({message:"Order Created"});
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
};

module.exports.getOrder = async (req, res) => {
  try {
    const menuItem = await OrderModel.findOne({
      where: { id: req?.params?.id },
    });

    return res.status(200).send(menuItem);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
};
module.exports.deleteOrder = async (req, res) => {
  try {
    await OrderModel.destroy({
      where: { id: req?.params?.id },
    });

    return res
      .status(200)
      .send({ message: "Order has been deleted Successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
};

module.exports.listOrders = async (req, res) => {
  try {
    const list = await OrderModel.findAll({
      raw: true,
    });

    return res.status(200).send(list);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
};

module.exports.updateOrder = async (req, res) => {
  try {
    let { body } = req;
  
    await OrderModel.update(body, {
      where: { id: req?.params?.id },
    });

    res.status(200).send({ message: "order Successfully Updated" });
  } catch (err) {
    console.log(err.message);
    res.send({ message: err.message, error: true });
  }
};
