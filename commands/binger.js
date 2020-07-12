const Stat = require('../models/Stat');
const { MessageAttachment } = require('discord.js');
const { stats_id, admin_role_id, binger_gif, command_prefix } = require('../config/configs');

module.exports = {
    name: "binger",
    description: 'Sets the designated binger for the recording',
    cooldown: 60,
    args: false,
    execute(message, args, logger) {

        Stat.findById(stats_id).then(stat => {

            const reset = args.shift();
            const role = message.member.roles.cache.get(admin_role_id);

            if (reset === 'reset' && role) {
                stat.binger = '';
                return stat
                    .save()
                    .then(stat => {
                        logger.log('info', `Binger reset by the admin`);
                        message.channel
                            .send(`Binger successfully reset!`)
                            .catch(err => logger.log(err));
                    })
                    .catch(err => logger.log('error', err));
            }

            if (stat.binger === '') {

                stat.binger = message.member.id;
                return stat
                    .save()
                    .then(stat => {
                        logger.log('info', `Binger set to the id: ${stat.binger}`);
                        const prefix = message.guild.emojis.cache.find(emoji => emoji.name === command_prefix).toString();
                        const attachment = new MessageAttachment(binger_gif);
                        message.channel
                            .send({
                                content: `${message.author} Congrats!\nYou're the designated Binger:tm: for this recording! Use your bell powers with care!\n\nThe command to add another bellring is: **${prefix} bing**`,
                                files: [attachment]
                            })
                            .catch(err => logger.log('error', err));
                    });


            }

        })
            .catch(err => logger.log('error', err));


    },
};
