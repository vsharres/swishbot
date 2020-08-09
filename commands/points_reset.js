const Stat = require('../models/Stat');
const { stats_id, house_points_channel } = require('../config/configs');

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

            const hourglass = message.guild.channels.cache.get(house_points_channel);

            if (hourglass) {
                hourglass.bulkDelete(5)
                    .then(messages => {
                        logger.log('info', `Bulk deleted ${messages.size} messages`);
                        hourglass.send(`**House Points**\n\nGryffindor 🦁 with a total of: **0!**\n\nSlytherin 🐍 with a total of: **0!**\n\nRavenclaw 🦅 with a total of: **0!**\n\nHufflepuff 🦡 with a total of: **0!**\n\n`);
                    })
                    .catch(console.error);
            }

            stat
                .save()
                .then(stat => {
                    logger.log('info', `A new year has begun! All house points are reset.`);
                })
                .catch(err => logger.log('error', err));

        })
            .catch(err => logger.log('error', err));
    },
};