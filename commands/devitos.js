const config = require('../config/configs');

module.exports = {
    name: 'convert',
    description: 'Converts the provided number to devitos',
    cooldown: 120,
    usage:'<amount> <type>',
    args: true,
    execute(message,args) {

        const prefix = message.guild.emojis.cache.find(emoji => emoji.name === 'devitos').toString();

        //for the usage of having only on number on the args
        if(args.length === 1){
            let parsed = args.shift();
            let multiplier = 1;
            let unit= "cm";

            if(parsed.includes('m') || parsed.includes('meters') || parsed.includes('meter')){
                multiplier = 100;
                unit = "m"; 
            }
            else if(parsed.includes('cm') || parsed.includes('centimeters') || parsed.includes('centimeter')){
                multiplier = 1;
                unit = "cm";            
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
        else if(args.length == 2 && !isNaN(args[0])){
            let amount = 0;
            let multiplier = 1;
            let unit = "cm";
            amount = parseFloat(args.shift());
            unit = args.shift();

            if(unit == 'cm' || unit === 'centimeters' || unit === 'centimeter'){                  
                 multiplier = 1;
            }
            else if(unit === 'm' || unit === 'meters' || unit === 'meter' ){
                multiplier = 100;
            }
            else if(unit === 'km' || unit === 'kilometers' || unit === 'kilometer'){
                multiplier = 100000;
            }
            else if(unit === 'mi' || unit === 'miles' || unit === 'mile' ){
                multiplier = 160934;
            }
            else if(unit === 'yd' || unit === 'yards' || unit === 'yard'){
                 multiplier = 91.44;
            }
            else if(unit === 'inches' || unit === 'inch'){
                 multiplier = 2.54;                        
            }
            else if(unit === 'feet' || unit === 'foot'){
                 multiplier = 30.48;
            }
            else {
                return message.channel.send(`${message.author} the proper usage would be: ${prefix} \`${this.name} ${this.usage}\``);
            }       

            let devitos = (amount * multiplier / config.height).toFixed(7);
            devitos = new Intl.NumberFormat('en-IN').format(devitos);

            return message.channel.send(`${message.author} ${amount} ${unit} is ${devitos} ${prefix}!`);

        }
        else if(args.length > 2 && !isNaN(args[0]) && !isNaN(args[2]))
        {
            let firstAmount = 0;
            let secondAmount = 0;
            let firstmultiplier = 1;
            let secondMultiplier = 1;
            let firstunit = 'feet';
            let secondunit = 'inches';
            firstAmount = parseFloat(args.shift());
            firstunit = args.shift();
            secondAmount = parseFloat(args.shift());
            secondunit = args.shift();

            if( firstunit === 'feet' && secondunit === 'inches')
            {
                firstmultiplier = 30.48;
                secondMultiplier = 2.54;              
            }
            else {
                return message.channel.send(`${message.author} the proper usage would be: ${prefix} \`${this.name} ${this.usage}\``);
            }

            let devitos = ((firstAmount * firstmultiplier + secondAmount & secondMultiplier) / config.height).toFixed(7);
            devitos = new Intl.NumberFormat('en-IN').format(devitos);

            return message.channel.send(`${message.author} ${firstAmount} ${firstunit} ${secondMultiplier} ${secondunit} is ${devitos} ${prefix}!`);


        }
        else {
            return message.channel.send(`${message.author} the proper usage would be: ${prefix} \`${this.name} ${this.usage}\``);
        }   
        
    },
};
