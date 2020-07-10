const User = require('../models/User');
const { MessageAttachment } = require('discord.js');
const { Mongoose } = require('mongoose');

module.exports = {
    name: 'expecto_patronum',
    desciption: 'Cast the patronus spell',
    cooldown: 10,
    args: false,
    execute(message, args, logger) {

        User.findById(message.member.id).then(user => {
            if (user) {
                const attachment = new MessageAttachment(user.patronus);
                let wand = message.guild.emojis.cache.find(emoji => emoji.name === 'wand');

                message.channel
                    .send({
                        content: `${message.author} Expecto Patronum!! ${wand ? wand.toString() : ':zap:'}:zap::zap:`,
                        files: [attachment]
                    })
                    .catch(err => logger.log('error', err));

            }
            else {
                logger.log('info', `${message.author} please save your patronus first with the command \`eligere_patronum!\``);
                message.channel
                    .send(`${message.author} please save your patronus first with the command \`eligere patronum!\``)
                    .catch(err => logger.log('error', err));
            }
        });
    },
};
