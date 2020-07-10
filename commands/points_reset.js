const Stat = require('../models/Stat');
const { stats_id, house_points_channel } = require('../config/configs');

module.exports = {
    name: "points_reset",
    description: '',
    cooldown: 10,
    usage: '',
    admin: true,
    args: false,
    async execute(message, arg) {

        Stat.findById(stats_id).then(stat => {
            if (!stat)
                return;

            stat.points.push({
                gryffindor: 0,
                slytherin: 0,
                ravenclaw: 0,
                hufflepuff: 0
            });

            const hourglass = message.guild.channels.cache.find(channel =>
                channel.name === house_points_channel
            );

            hourglass.bulkDelete(5)
                .then(messages => {
                    console.log(`Bulk deleted ${messages.size} messages`);
                })
                .catch(console.error);

            stat
                .save()
                .then(stat => {
                    hourglass.send(`**House Points**\n\nGryffindor 🦁 with a total of: **0!**\n\nSlytherin 🐍 with a total of: **0!**\n\nRavenclaw 🦅 with a total of: **0!**\n\nHufflepuff 🦡 with a total of: **0!**\n\n`);
                    console.log(`A new year has begun! All house points are reset.`);
                })
                .catch(err => console.log(err));

        })
            .catch(err => console.log(err));
    },
};