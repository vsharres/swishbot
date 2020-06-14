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
            let multiplier = 1;
            let unit= "cm";

            if(parsed.includes('cm')){
                multiplier = 1;
                unit = "cm";            
            }
            else if(parsed.includes('m')){
                multiplier = 100;
                unit = "m"; 

            }
            else if(parsed.includes('km')){
                multiplier = 100000;
                unit = "km";
            }
            else if(parsed.includes('mi')){
                multiplier = 160934;
                unit = "mi";          
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
                return message.channel.send(`${message.author} the proper usage would be: ${config.prefix} \`${this.name} ${this.usage}\``);
            }

            parsed = parsed.substring(0,parsed.length - unit.length);
            let amount = parseFloat(parsed); 
            let devitos = (amount * multiplier / config.height).toFixed(7);

            return message.channel.send(`${message.author} ${amount} ${unit} is ${devitos} ${config.prefix}!`);


        }

        //for more than one arg in the command, as if the unit is separate from the number
        if(args.length >= 2){
            let amount = 0;
            let multiplier = 1;
            let unit = "cm";

            if(args.includes('cm')){                  
                 multiplier = 1;
            }
            else if(args.includes('m')){
                multiplier = 100;
            }
            else if(args.includes('km')){
                multiplier = 100000;
            }
            else if(args.includes('mi') || args.includes('miles')){
                multiplier = 160934;
            }
            else if(args.includes('inches')){
                 multiplier = 2.54;                        
            }
            else if(args.includes('feet')){
                 multiplier = 30.48;
            }
            else {
                return message.channel.send(`${message.author} the proper usage would be: ${config.prefix} \`${this.name} ${this.usage}\``);
            }

            amount = parseFloat(args.shift());
            unit = args.shift();

            let devitos = (amount * multiplier / config.height).toFixed(7);

            return message.channel.send(`${message.author} ${amount} ${unit} is ${devitos} ${config.prefix}!`);

        }   
        
    },
};