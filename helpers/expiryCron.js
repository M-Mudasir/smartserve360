const cron = require('node-cron');
const { Op } = require('sequelize');
const db = require("../models/index");
const {Sequelize} =  require("sequelize");

const NotificationModel = db.notifications;
const InventoryModel = db.inventories;

const checkExpiryAndCreateNotification = async () => {
    try {
        const today = new Date();
        const oneWeekLater = new Date();
        oneWeekLater.setDate(today.getDate() + 7);

        const expiringItems = await InventoryModel.findAll({
            where: {
                expiryDate: {
                    [Op.lte]: oneWeekLater,
                },
            },
        });
        
        expiringItems.forEach(async (item) => {
            const remainingTime = item.expiryDate - today;
            const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));

            if (remainingDays >= 0 && remainingDays <= 7) {

                await NotificationModel.create({
                    title: 'Expiry alert',
                    message: `The expiry date of ${item.title} is approaching. Remaining days: ${remainingDays}`,
                    isRead: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                console.log({
                    title: 'Expiry alert',
                    message: `The expiry date of ${item.title} is approaching. Remaining days: ${remainingDays}`,
                    isRead: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
            }
        });

        console.log('Expiry alert check completed.');
    } catch (error) {
        console.error('Error checking expiry and creating notifications:', error);
    }
};


const checkLowStockAndCreateNotification = async () => {
    try {
        // Check for items with remaining quantity equal to 20% of quantity
        const lowStockItems = await InventoryModel.findAll({
            where: {
                remainingQuantity: {
                    [Op.lte]: Sequelize.literal('0.2 * quantity'),
                },
            },
        });

        lowStockItems.forEach(async (item) => {
            await NotificationModel.create({
                title: 'Low Stock Alert',
                message: `The remaining quantity of ${item.title} is low.`,
                isRead: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log('Low stock alert created:', {
                title: 'Low Stock Alert',
                message: `The remaining quantity of ${item.title} is low.`,
                isRead: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        });

        console.log('Low stock alert check completed.');
    } catch (error) {
        console.error('Error checking low stock and creating notifications:', error);
    }
};

// Schedule both cron jobs with the same interval for 12th hour
cron.schedule('0 12 * * *', async () => {
    checkExpiryAndCreateNotification();
    checkLowStockAndCreateNotification();
});

// for every 5 seconds
// cron.schedule('*/5 * * * * *', async () => {
//     checkExpiryAndCreateNotification();
//     checkLowStockAndCreateNotification();
// });