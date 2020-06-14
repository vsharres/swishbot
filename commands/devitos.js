const config = require('../config/configs');

module.exports = {
    name: 'convert',
    description: 'Converts the provided number to devitos',
    cooldown: 1,
    usage:'<amount> <type>',
    args: true,
    execute(message,args) {

        //for the usage of having only on number on the args
        if(args.length === 1){
            let parsed = args[0];
            if(parsed.includes('cm')){
                parsed = parsed.substring(0,parsed.length - 1);

                let amount = parseFloat(parsed);    
                let devitos = (amount / config.height).toFixed(7);  

                return message.channel.send(`${message.author} ${amount} cm is ${devitos} ${config.prefix}!`);
            }
            else if(parsed.includes('m')){
                parsed = parsed.substring(0,parsed.length - 1);

                let amount = parseFloat(parsed);    
                let devitos = (amount * 100 / config.height).toFixed(7);  

                return message.channel.send(`${message.author} ${amount} m is ${devitos} ${config.prefix}!`);


            }
            else if(args[0].includes("'") || args[0].includes('"') ){
                const rex = /^(?!$|.*\'[^\x22]+$)(?:([0-9]+)\')?(?:([0-9]+)\x22?)?$/;
                const match = rex.exec(args.shift());
                if(match){
                    let feet = parseFloat(match[1]) ? parseFloat(match[1]) : 0;
                    let inches = parseFloat(match[2]) ? parseFloat(match[2]) : 0;

                    const devitos = (((feet * 30.48) + (inches * 2.54)) / config.height).toFixed(7);    
                    return message.channel.send(`${message.author} ${feet > 0 ? feet+"'" : ''}${inches > 0 ? inches+ '"' : ''} is ${devitos} ${config.prefix}!`);
    
                }
    
            }      
            else{
                return message.channel.send(`${message.author} the proper usage would be: \`${config.prefix} ${this.name} ${this.usage}\``);
            }

        }

        //for more than one arg in the command, as if the unit is separate from the number
        if(args.length >= 2){
            let amount = 0;
            let unit = "";
            let devitos = 0.0;

            if(args.includes('cm')){
                 amount = parseFloat(args.shift());
                 unit = args.shift(); 
                 devitos = (amount / config.height).toFixed(7);
    
            }
            else if(args.includes('m')){
                 amount = parseFloat(args.shift());
                 unit = args.shift();
                 devitos = (amount * 100 / config.height).toFixed(7);
    
            }
            else if(args.includes('inches')){
                 amount = parseFloat(args.shift());
                 unit = args.shift();
                 devitos = (amount * 2.54 / config.height).toFixed(7);

                
            }
            else if(args.includes('feet')){
                 amount = parseFloat(args.shift());
                 unit = args.shift();
                 devitos = (amount * 2.54 / config.height).toFixed(7);

            }
            else {
                return message.channel.send(``);
            }

            return message.channel.send(`${message.author} ${amount} ${unit} is ${devitos} ${config.prefix}!`);

        }   
        
    },
};