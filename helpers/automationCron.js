const cron = require('node-cron');
const db = require("../models/index");
const { Sequelize } = require("sequelize");

const NotificationModel = db.notifications;
const InventoryModel = db.inventories;
const AutomationModel = db.automations;

module.exports.AutomatedProcurement = async () => {
    try {
        const today = new Date();

        const automatedItems = await AutomationModel.findAll({ raw: true, });

        for (const item of automatedItems) {

            const expiryDate = new Date();
            expiryDate.setDate(today.getDate() + item.expiryInDays);

            const inventory = await InventoryModel.findOne({
                where: { id: item.inventoryId },
            });

            if (inventory.automation) {
                cron.schedule(`0 0 */${item.interval} * *`, async () => {
                    // cron.schedule(`*/5 * * * * *`, async () => {
                    try {

                        await InventoryModel.update({
                            totalQuantity: Sequelize.literal(`totalQuantity + ${item.automated_quantity}`),
                            quantity: item.automated_quantity,
                            remainingQuantity: Sequelize.literal(`remainingQuantity + ${item.automated_quantity}`),
                            expiryDate: expiryDate
                        }, {
                            where: { id: item.inventoryId },
                        });

                        await NotificationModel.create({
                            title: 'Automated Procurement Successful!',
                            message: `The quantity of item ${inventory.title} has been automatically updated.`,
                            isRead: false,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        });
                        console.log({
                            title: 'Automated Procurement Successful!',
                            message: `The quantity of item ${inventory.title} has been automatically updated.`,
                            isRead: false,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        })

                    } catch (error) {
                        console.error('Error in updating inventory:', error);
                    }

                });
            }
        };
    } catch (error) {
        console.error('Error in Updating Automated Request:', error);
    }
};

