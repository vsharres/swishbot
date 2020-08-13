const Stat = require('../models/Stat');
const { stats_id } = require('../config/configs');
const printer = require('../tools/print_points');

module.exports = {
    name: "points_reset",
    description: '',
    cooldown: 10,
    usage: '',
    admin: true,
    args: false,
    async execute(message, arg, logger) {

        Stat.findById(stats_id).then(stat => {
            if (!stat)
                return;

            stat.points.push({
                gryffindor: 0,
                slytherin: 0,
                ravenclaw: 0,
                hufflepuff: 0
            });

            printer.printPoints(message, stat.points[stat.points.length - 1], logger);

            stat
                .save()
                .then(() => {
                    logger.log('info', `A new year has begun! All house points are reset.`);
                })
                .catch(err => logger.log('error', err));

        })
            .catch(err => logger.log('error', err));
    },
};