const config = require('../config/config');


module.exports = {
    name: ':devitos:',
    description: 'Converts the provided number to devitos',
    cooldown: 1,
    args: true,
    execute(message,args) {
        //parse

        if(args.includes('cm')){
            const amount = parseFloat(args.shift());
            const unit = args.shift();

            const devitos = (amount / config.height).toFixed(7);


            message.channel.send(`${message.author} ${amount} ${unit} is ${devitos} :devitos:`);
        }
        else if(args.includes('m')){
            const amount = parseFloat(args.shift());
            const unit = args.shift();

            const devitos = (amount * 100 / config.height).toFixed(7);


            message.channel.send(`${message.author} ${amount} ${unit} is ${devitos} :devitos:`);
        }
        else if(args[0].includes("'") || args[0].includes('"') ){
            const rex = /^(\d+)'(\d+)(?:''|")$/;
            const match = rex.exec(args.shift());
            if(match){
                const feet = parseFloat(match[1]);
                const inches = parseFloat(match[2]);

                const devitos = (((feet * 30.48) + (inches * 2.54)) / config.height).toFixed(7);

                message.channel.send(`${message.author} ${feet}'${inches}" is ${devitos} :devitos:`);

            }

        }      
        
    },
};