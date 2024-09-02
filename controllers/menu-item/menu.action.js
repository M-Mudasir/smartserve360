const db = require("../../models/index");
const MenuItemModel = db.menu_items;
const helper = require("../../helpers/azure-blob")
const uploadImage = helper.uploadFileToBlobStorage
const SystemLogModel = db.system_logs;


module.exports.createMenuItem = async (req, res) => {
  try {
    const { body, file } = req;

    if (!file) {
      throw new Error("No file uploaded");
    }
    const blobName = file.originalname;
    const blobUrl = await uploadImage(file.buffer, blobName);

    const menuItem = await MenuItemModel.create({
      title: body?.title,
      servingSize: body?.servingSize,
      subCategory: body?.subCategory,
      category: body?.category,
      recipe: body?.recipe,
      price: body?.price,
      isActive: body?.isActive,
      ingredient: JSON.parse(body?.ingredient),
      imgUrl: blobUrl,

    });
    await SystemLogModel.create({
      title: "New Menu Item Added!",
      description:`Menu Item ${body?.title} has been created`,
      type:"info"
    });

    return res.status(200).send(menuItem);
  } catch (err) {
    console.log(err.message);
    res.send({ message: err.message, error: true });
  }
};

module.exports.updateMenuItem = async (req, res) => {
  try {
    const { body, file } = req;
    const menuItem = await MenuItemModel.findOne({
      where: { id: req.params.id }, raw: true,
    })
    const updatedBody = {
      title: body.title,
      servingSize: body.servingSize,
      category: body.category,
      subCategory: body.subCategory,
      recipe: body.recipe,
      price: body.price,
      isActive: body.isActive,
      ingredient: body.ingredient,
    }

    if (!file) {
      await MenuItemModel.update(
        updatedBody,
        {
          where: {
            id: req?.params?.id,
          }
        }
      );
    } else {
      const blobName = file.originalname;
      const blobUrl = await uploadImage(file.buffer, blobName);
      await MenuItemModel.update(
        {
          ...updatedBody,
          imgUrl: blobUrl
        },
        {
          where: {
            id: req?.params?.id,
          }
        }
      );
    }
    await SystemLogModel.create({
      title: "Menu Item Updated!",
      description:`Menu Item ${menuItem?.title} has been updated`,
      type:"warning"
    });

    return res.status(200).send({ message: 'Menu item updated' });
  } catch (err) {
    console.log(err.message);
    res.send({ message: err.message, error: true });
  }
};

module.exports.getMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItemModel.findOne({
      where: { id: req?.params?.id },
      raw: true,
    });
    if (!menuItem) {
      return res.status(404).send({ message: 'Menu item not found' });
    }

    return res.status(200).send(menuItem);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
};

module.exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItemModel.findOne({
      where: { id: req?.params?.id },
      raw: true
    })
    await MenuItemModel.destroy({
      where: { id: req?.params?.id },
    });

    await SystemLogModel.create({
      title: "Menu Item Deleted!",
      description:`Menu Item ${menuItem?.title} has been deleted`,
      type:"error"
    });

    return res
      .status(200)
      .send({ message: "Menu Item has been deleted Successfully" });
  } catch (err) {
    console.log(err.message);
    res.send({ message: err.message, error: true });
  }
};

module.exports.listMenuItem = async (req, res) => {
  try {
    const list = await MenuItemModel.findAll({
      raw: true,
    });
    const data = [];
    for (const item of list) {
      data.push({
        ...item,
        price: item.price + " $",
        servingSize: `${item.servingSize} ${item.servingSize > 1 ? "persons" : "person"}`,
      });
    }
    return res.status(200).send(data);
  } catch (err) {
    console.log(err.message);
    res.send({ message: err.message, error: true });
  }
};
