const db = require("../../models/index");

const NotificationModel = db.notifications;

module.exports.listNotifications = async (req, res) => {
    try {
        const list = await NotificationModel.findAll({
            limit: 20,
            raw: true,
        });

        return res.status(200).send(list);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};

module.exports.readNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await NotificationModel.findByPk(id);

        if (!notification) {
            return res.status(404).send({ message: "Notification not found" });
        }
        await notification.update({ isRead: true });
        return res.status(200).send({ message: "Notification marked as read" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};