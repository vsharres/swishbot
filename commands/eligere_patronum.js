const User = require('../models/User');

module.exports = {
    name: 'eligere_patronum',
    desciption: 'Choose the patronus',
    cooldown: 5,
    attachments: true,
    attachment_size: 500,
    usage: `<image/gif>`,
    args: false,
    execute(message, args) {
        const attachment = message.attachments.first();

        User.findById(message.member.id).then(user => {
            if (user) {
                user.patronus = attachment.url;
                user
                    .save()
                    .then(user => {
                        console.log(`${message.author} Patronus updated!`);
                        message.channel
                            .send(`${message.author} Patronus updated!`)
                            .catch(err => console.log(err));
                    })
                    .catch(err => console.log(err));

            }
            else {
                const newUser = new User({
                    _id: message.member.id,
                    patronus: attachment.url
                });

                newUser
                    .save()
                    .then(user => {
                        console.log(`${message.author} Patronus created!`);

                        message.channel
                            .send(`${message.author} Patronus saved!`)
                            .catch(err => console.log(err));
                    })
                    .catch(err => console.log(err));

            }
        });

    },
};