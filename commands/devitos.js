const config = require('../config/configs');

module.exports = {
    name: 'convert',
    description: 'Converts the provided number to devitos',
    cooldown: 10,
    usage: '<amount> <type>',
    args: true,
    execute(message, args) {

        const prefix = config.command_prefix;

        //for the usage of having only on number on the args
        if (args.length === 1) {
            let parsed = args.shift();
            let multiplier = 1;
            let unit = parsed.replace(/[0-9]/g, '');

            //for the special case of using ' or "
            const rex = /^(?!$|.*\'[^\x22]+$)(?:([0-9]+)\')?(?:([0-9]+)\x22?)?$/;
            const match = rex.exec(parsed);
            if (match) {
                let feet = parseFloat(match[1]) ? parseFloat(match[1]) : 0;
                let inches = parseFloat(match[2]) ? parseFloat(match[2]) : 0;

                const devitos = (((feet * 30.48) + (inches * 2.54)) / config.height).toFixed(7);
                return message.channel.send(`${message.author} ${feet > 0 ? feet + "'" : ''}${inches > 0 ? inches + '"' : ''} is ${devitos} ${prefix}!`);

            }

            switch (unit) {
                case 'm':
                    multiplier = 100;
                    break;
                case 'meters':
                    multiplier = 100;
                    break;
                case 'meter':
                    multiplier = 100;
                    break;
                case 'cm':
                    multiplier = 1;
                    break;
                case 'centimeters':
                    multiplier = 1;
                    break;
                case 'centimeter':
                    multiplier = 1;
                    break;
                case 'km':
                    multiplier = 100000;
                    break;
                case 'kilometers':
                    multiplier = 100000;
                    break;
                case 'kilometer':
                    multiplier = 100000;
                    break;
                case 'yd':
                    multiplier = 91.44;
                    break;
                case 'yard':
                    multiplier = 91.44;
                    break;
                case 'yards':
                    multiplier = 91.44;
                    break;
                case 'mi':
                    multiplier = 160934;
                    break;
                case 'mile':
                    multiplier = 160934;
                    break;
                case 'miles':
                    multiplier = 160934;
                    break;
                default:
                    return message.channel.send(`${message.author} the proper usage would be: ${prefix} \`${this.name} ${this.usage}\``);
            }

            parsed = parsed.substring(0, parsed.length - unit.length);
            let amount = parseFloat(parsed);
            let devitos = (amount * multiplier / config.height).toFixed(7);
            devitos = new Intl.NumberFormat('en-IN').format(devitos);

            return message.channel.send(`${message.author} ${amount} ${unit} is ${devitos} ${prefix}!`);


        }
        //for more than one arg in the command, as if the unit is separate from the number
        else if (args.length == 2 && !isNaN(args[0])) {
            let amount = 0;
            let multiplier = 1;
            let unit = "cm";
            amount = parseFloat(args.shift());
            unit = args.shift();

            switch (unit) {
                case 'cm':
                    multiplier = 1;
                    break;
                case 'centimeters':
                    multiplier = 1;
                    break;
                case 'centimeter':
                    multiplier = 1;
                    break;
                case 'm':
                    multiplier = 100;
                    break;
                case 'meter':
                    multiplier = 100;
                    break;
                case 'meters':
                    multiplier = 100;
                    break;
                case 'km':
                    multiplier = 100000;
                    break;
                case 'kilometer':
                    multiplier = 100000;
                    break;
                case 'kilometers':
                    multiplier = 100000;
                    break;
                case 'mi':
                    multiplier = 160934;
                    break;
                case 'mile':
                    multiplier = 160934;
                    break;
                case 'miles':
                    multiplier = 160934;
                    break;
                case 'yd':
                    multiplier = 91.44;
                    break;
                case 'yard':
                    multiplier = 91.44;
                    break;
                case 'yards':
                    multiplier = 91.44;
                    break;
                case 'inches':
                    multiplier = 2.54;
                    break;
                case 'inch':
                    multiplier = 2.54;
                    break;
                case 'feet':
                    multiplier = 30.48;
                    break;
                case 'foot':
                    multiplier = 30.48;
                    break;
                default:
                    return message.channel.send(`${message.author} the proper usage would be: ${prefix} \`${this.name} ${this.usage}\``);
            }

            let devitos = (amount * multiplier / config.height).toFixed(7);
            devitos = new Intl.NumberFormat('en-IN').format(devitos);

            return message.channel.send(`${message.author} ${amount} ${unit} is ${devitos} ${prefix}!`);

        }
        else if (args.length > 2 && !isNaN(args[0]) && !isNaN(args[2])) {
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

            if (firstunit === 'feet' && secondunit === 'inches') {
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
