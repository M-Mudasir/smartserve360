const db = require("../../models/index");
const VendorOrderModel = db.vendor_orders;
const PurchaseOrderModel = db.purchase_orders;
const InventoryModel = db.items;
const dayjs =  require("dayjs")


module.exports.createVendorOrder = async (req, res) => {
  try {
    const { body } = req;
    console.log(body)
    if (body.expiryDate && body.dispatchDate) {
        const dispatchDate = dayjs(body.dispatchDate, 'DD/MM/YYYY'); // Assuming date format is 'DD/MM/YYYY'
        const expiryDate = dayjs(body.expiryDate, 'DD/MM/YYYY'); // Assuming date format is 'DD/MM/YYYY'
        
        // Check if the expiry date is greater than the purchase date
        if (expiryDate <= dispatchDate) {
          return res.send({ message: "Expiry date should be greater than the dispatch  date." , error: true});
        }
      }
    const item = await VendorOrderModel.findOne({
        where:{
            inventoryId:body?.inventoryId
        }
    });
    if(item){
        await VendorOrderModel.update(
            {
                quantity: parseInt(item?.quantity) + parseInt(body?.quantity),
                expiryDate: body?.expiryDate
            },
            {
                where:{
                    inventoryId:body?.inventoryId
                },
              returning: true,
            }
          );
    }
    else{
        await VendorOrderModel.create(body);
    }

    

    return res.status(200).send({ message: item ? "Vendor Data has been Updated" :"Vendor Data has been Created" });
  } catch (err) {
    console.log(err.message);
    res.send({ message: err.message , error:true });
  }
};

module.exports.getVendorOrder = async (req, res) => {
  try {
    const menuItem = await VendorOrderModel.findOne({
      where: { id: req?.params?.id },
    });

    return res.status(200).send(menuItem);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
};
module.exports.deleteVendorOrder = async (req, res) => {
  try {
    await VendorOrderModel.destroy({
      where: { id: req?.params?.id },
    });
    await VendorOrderDetailModel.destroy({
      where: { VendorOrderId: req?.params?.id },
    });

    return res
      .status(200)
      .send({ message: "VendorOrder have been deleted Successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
};

module.exports.listVendorOrders = async (req, res) => {
  try {
    const list = await VendorOrderModel.findAll({
      raw: true,
    });

    return res.status(200).send(list);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
};


module.exports.getDispatch = async (req, res) => {
    try {
    
      const data ={}
      const vendorOrder = await VendorOrderModel.findOne({
        where: { inventoryId: req?.query?.inventoryId },
      });
      data.dispatchQuantity = vendorOrder?.quantity || 0
  
      const purchase_orders = await  PurchaseOrderModel.findOne({
        where: { id: req?.query?.purchaseOrderId },
      })
      data.demandQuantity = purchase_orders?.quantityRequested - purchase_orders?.quantityAllocated  || 0

      console.log(data)
      return res.status(200).send(data);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({ message: err.message });
    }
  };

  module.exports.updateDispatch = async (req, res) => {
    try {
      const { body } = req;
  
      const inventory = await InventoryModel.findOne({
        where: {
          id: body?.inventoryId
        },
        raw: true
      });
  
      const purchaseOrder = await PurchaseOrderModel.findOne({
        where: {
          id: body?.id
        },
        raw: true
      });
  
      let vendorOrder = await VendorOrderModel.findOne({
        where: {
          inventoryId: body?.inventoryId
        },
        raw: true
      });
  
      console.log(1,inventory ,2,purchaseOrder,3,vendorOrder,!inventory || !purchaseOrder || !vendorOrder)
      if (!inventory || !purchaseOrder || !vendorOrder) {
        return res.send({ message: "Vendor Order Not Found", error: true });
      }
  
      let purchaseOrderUpdate = {};
      let vendorOrderUpdate = {};
      let inventoryUpdate = {};
  
      if (body?.demandQuantity > body?.dispatchQuantity) {
        vendorOrderUpdate = { quantity: 0 };
        purchaseOrderUpdate = { quantityAllocated: body?.demandQuantity - body?.dispatchQuantity, status: 'Incomplete' };
        inventoryUpdate = { quantity: inventory.quantity + (body?.demandQuantity - body?.dispatchQuantity) };
      } else if (body?.demandQuantity < body?.dispatchQuantity) {
        vendorOrderUpdate = { quantity: body?.dispatchQuantity - body?.demandQuantity };
        purchaseOrderUpdate = { quantityAllocated: body?.demandQuantity, status: 'Completed' };
        inventoryUpdate = { quantity: inventory.quantity + body?.demandQuantity };
      } else {
        vendorOrderUpdate = { quantity: 0 };
        purchaseOrderUpdate = { quantityAllocated: body?.demandQuantity, status: 'Completed' };
        inventoryUpdate = { quantity: inventory.quantity + body?.demandQuantity };
      }
  
      // Update all records in a single database call
      await Promise.all([
        VendorOrderModel.update(vendorOrderUpdate, { where: { inventoryId: body?.inventoryId } }),
        PurchaseOrderModel.update(purchaseOrderUpdate, { where: { id: body?.id } }),
        InventoryModel.update(inventoryUpdate, { where: { id: body?.inventoryId } }),
      ]);
  
      return res.status(200).send({ message: "Order has been processed Successfully" });
    } catch (err) {
      console.log(err.message);
      res.send({ message: "Some Error Occurred", error: true });
    }
  };
  