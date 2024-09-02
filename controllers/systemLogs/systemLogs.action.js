const db = require("../../models/index");
const SystemLogModel = db.system_logs;
const { Op } = require('sequelize');
const moment = require('moment');

module.exports.listLogs = async (req, res) => {
    try {
        const todayStart = moment().startOf('day').toDate();
        const todayEnd = moment().endOf('day').toDate(); 

        const activities = await SystemLogModel.findAll({
            where: {
                createdAt: {
                    [Op.between]: [todayStart, todayEnd] 
                }
            },
            order: [['createdAt', 'DESC']],
            raw: true,
        });

        return res.status(200).send(activities);
    } catch (err) {
        console.log(err.message);
        res.send({ message: err.message, error: true });
    }
};
