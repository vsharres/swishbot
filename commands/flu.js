
const mia_id =0;
const marchismo_id=0;
const brandon_id=0; 

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
                        channel.send(`Hello Swisher!\nJust a reminder, we are planning a surprise thank you gift to the hosts of Swish and Flick on their anniversary. We thought it would be fun to all leave messages on what they mean to us!\nWe have had some hiccups with the google form we are using to collect answers. If you run into an issue where the form isn't working OR you need to edit or resubmit your response please privately direct message: @mia-gilli @marchismo @Brandon Seabaugh or @ViniciusHarres.\nIf you want to participate, click the link below. Don't forget this is supposed to be a **SURPRISE**, ~~please don't discuss in the general discord chat~~. The deadline for submitting a message is **July 15th!**\nhttps://forms.gle/2EZRaUJQsymPHgEZ8`)
                                .catch(err=>console.error(err));
                })
                    .catch(err=>console.error(err));
                }               
            });          
        })
        .catch(err=>console.error(err));
        

       
    },
};
