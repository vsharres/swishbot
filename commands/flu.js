
module.exports = {
    name: "flu!",
    description: 'Sends a message to all discord members',
    cooldown: 1,
    usage: '<Roles to Exclude>',
    args: false, //Args are optional, by default only the bot does not get the message
    execute(message,args) {

        args.push('Bot');

        message.guild.members.fetch()
        .then(members=>{
            members.forEach(member => {              
                let roles = member.roles.cache.find(role=> args.includes(role.name));
                if(!roles)
                {
                    member.createDM()
                    .then(channel=> {
                        channel.send(`Hello! \nHere is the link to the google docs with the text to be sent for our lovely hosts! https://docs.google.com/forms/d/1MQAA7uw2wV_pUPtF6OUy9NiCz0vJd-LkCACT497ygK4/edit?usp=sharing`)
                                .catch(err=>console.error(err));
                })
                    .catch(err=>console.error(err));
                }               
            });          
        })
        .catch(err=>console.error(err));

       
    },
};
