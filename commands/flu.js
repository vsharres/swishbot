
module.exports = {
    name: "flu!",
    description: 'Sends a message to all discord members',
    cooldown: 1,
    usage: '<Roles to Exclude>',
    args: false, //Args are optional, by default only the bot does not get the message
    execute(message,args) {

        args.push('Bot');
        args.push('Hogwarts Ghosts');

        message.guild.members.fetch()
        .then(members=>{
            members.forEach(member => {              
                let roles = member.roles.cache.find(role=> args.includes(role.name));
                if(!roles)
                {
                    member.createDM()
                    .then(channel=> {
                        channel.send(`This is a correction on the previous message, the correct link for submitting the message is: 
                        https://docs.google.com/forms/d/e/1FAIpQLSd3Jh1sxna3ljo19t5LE5V498hTarbqvnNKCCKOijmoU3H8gA/viewform?usp=sf_link`)
                                .catch(err=>console.error(err));
                })
                    .catch(err=>console.error(err));
                }               
            });          
        })
        .catch(err=>console.error(err));

       
    },
};
