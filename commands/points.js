const Stat = require('../models/Stat');
const { stats_id } = require('../config/configs');
const printer = require('../tools/print_points');

module.exports = {
    name: "points",
    description: '',
    cooldown: 10,
    usage: '',
    args: false,
    execute(message, arg, logger) {

        Stat.findById(stats_id).then(stat => {

            const points = stat.points[stat.points.length - 1];

            printer.printPoints(message, points, logger);

        })
            .catch(err => logger.log('error', err));
    },
};