const config = require('../config/configs');

module.exports = {
    name: 'convert',
    description: 'Converts the provided number to devitos',
    cooldown: 1,
    usage:'<amount> <type>',
    args: true,
    execute(message,args) {

        const prefix = message.guild.emojis.cache.find(emoji => emoji.name === 'devitos').toString();

        //for the usage of having only on number on the args
        if(args.length === 1){
            let parsed = args[0];
            let multiplier = 1;
            let unit= "cm";

            if(parsed.includes('cm') || parsed.includes('centimeters') || parsed.includes('centimeter')){
                multiplier = 1;
                unit = "cm";            
            }
            else if(parsed.includes('m') || parsed.includes('meters') || parsed.includes('meter')){
                multiplier = 100;
                unit = "m"; 

            }
            else if(parsed.includes('km') || parsed.includes('kilometers') || parsed.includes('kilometer')){
                multiplier = 100000;
                unit = "km";
            }
            else if(parsed.includes('yd') || parsed.includes('yards') || parsed.includes('yard')){
                multiplier = 91.44;
                unit =  "yd";

            }
            else if(parsed.includes('mi') || parsed.includes('miles') || parsed.includes('mile')){
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
                    return message.channel.send(`${message.author} ${feet > 0 ? feet+"'" : ''}${inches > 0 ? inches+ '"' : ''} is ${devitos} ${prefix}!`);
    
                }
    
            }      
            else{
                return message.channel.send(`${message.author} the proper usage would be: ${prefix} \`${this.name} ${this.usage}\``);
            }

            parsed = parsed.substring(0,parsed.length - unit.length);
            let amount = parseFloat(parsed); 
            let devitos = (amount * multiplier / config.height).toFixed(7);
            devitos = new Intl.NumberFormat('en-IN').format(devitos);

            return message.channel.send(`${message.author} ${amount} ${unit} is ${devitos} ${prefix}!`);


        }

        //for more than one arg in the command, as if the unit is separate from the number
        if(args.length >= 2){
            let amount = 0;
            let multiplier = 1;
            let unit = "cm";

            if(args.includes('cm') || args.includes('centimeters') || args.includes('centimeter')){                  
                 multiplier = 1;
            }
            else if(args.includes('m') || args.includes('meters') ||args.includes('meter') ){
                multiplier = 100;
            }
            else if(args.includes('km') || args.includes('kilometers') || args.includes('kilometer')){
                multiplier = 100000;
            }
            else if(args.includes('mi') || args.includes('miles') || args.includes('mile') ){
                multiplier = 160934;
            }
            else if(args.includes('yd') || args.includes('yards') || args.includes('yard')){
                 multiplier = 91.44;
            }
            else if(args.includes('inches') || args.includes('inch')){
                 multiplier = 2.54;                        
            }
            else if(args.includes('feet') || args.includes('foot')){
                 multiplier = 30.48;
            }
            else {
                return message.channel.send(`${message.author} the proper usage would be: ${prefix} \`${this.name} ${this.usage}\``);
            }

            amount = parseFloat(args.shift());
            unit = args.shift();

            let devitos = (amount * multiplier / config.height).toFixed(7);
            devitos = new Intl.NumberFormat('en-IN').format(devitos);

            return message.channel.send(`${message.author} ${amount} ${unit} is ${devitos} ${prefix}!`);

        }   
        
    },
};