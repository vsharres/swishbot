import { Configs } from '../config/configs';
import { Message } from 'discord.js'
import { Logger } from 'winston';
import { Command } from './command';

export class Devitos extends Command {

    constructor() {
        super("convert", 'Converts the provided number to devitos', 10, '<amount> <type>', true);
    }

    async execute(message: Message, args: string[], logger: Logger) {

        //for the usage of having only on number on the args
        if (args.length === 1) {
            let parsed = args.shift();
            let multiplier = 1;
            //Need to replace the regex so that . can be parsed out
            if (!parsed) {
                logger.log('error', `Error parsing the message.`)
                return message.channel.send(`${message.author.toString()} the proper usage would be: ${Configs.command_prefix} \`${this.name} ${this.usage}\``)
                    .catch(err => logger.log('error', err));
            }

            let unit = parsed.replace(/[0-9]/g, '');
            //for the special case of using ' or "
            const rex = /^(?!$|.*\'[^\x22]+$)(?:([0-9]+)\')?(?:([0-9]+)\x22?)?$/;
            const match = rex.exec(parsed);
            if (match) {
                let feet = parseFloat(match[1]) ? parseFloat(match[1]) : 0;
                let inches = parseFloat(match[2]) ? parseFloat(match[2]) : 0;

                const devitos = (((feet * 30.48) + (inches * 2.54)) / Configs.height);
                const devitos_string = new Intl.NumberFormat('en-IN').format(devitos);
                return message.channel.send(`${message.author.toString()} ${feet > 0 ? feet + "'" : ''}${inches > 0 ? inches + '"' : ''} is ${devitos_string} ${Configs.command_prefix}!`)
                    .catch(err => logger.log('error', err));

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
                    return message.channel.send(`${message.author.toString()} the proper usage would be: ${Configs.command_prefix} \`${this.name} ${this.usage}\``)
                        .catch(err => logger.log('error', err));
            }

            parsed = parsed.substring(0, parsed.length - unit.length);
            const amount = parseFloat(parsed);
            const devitos = (amount * multiplier / Configs.height);
            const devitos_string = new Intl.NumberFormat('en-IN').format(devitos);

            return message.channel.send(`${message.author.toString()} ${amount} ${unit} is ${devitos_string} ${Configs.command_prefix}!`)
                .catch(err => logger.log('error', err));


        }
        //for more than one arg in the command, as if the unit is separate from the number
        else if (args.length == 2 && !isNaN(parseFloat(args[0]))) {
            let parsed = args.shift();
            let multiplier = 1;
            if (!parsed) {
                logger.log('error', `Error parsing the message.`)
                return message.channel.send(`${message.author.toString()} the proper usage would be: ${Configs.command_prefix} \`${this.name} ${this.usage}\``)
                    .catch(err => logger.log('error', err));
            }

            let amount = parseFloat(parsed);
            let unit = args.shift();

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
                    return message.channel.send(`${message.author.toString()} the proper usage would be: ${Configs.command_prefix} \`${this.name} ${this.usage}\``)
                        .catch(err => logger.log('error', err));
            }

            const devitos = (amount * multiplier / Configs.height);
            const string_devitos = new Intl.NumberFormat('en-IN').format(devitos);

            return message.channel.send(`${message.author.toString()} ${amount} ${unit} is ${string_devitos} ${Configs.command_prefix}!`);

        }
        else if (args.length === 3) {
            let firstAmount = 0;
            let secondAmount = 0;
            let firstmultiplier = 1;
            let secondMultiplier = 1;
            let firstunit = 'feet';
            let secondunit = 'inches';
            let parsed = args.shift();
            if (!parsed) {
                logger.log('error', `Error parsing the message.`)
                return message.channel.send(`${message.author.toString()} the proper usage would be: ${Configs.command_prefix} \`${this.name} ${this.usage}\``);
            }

            firstAmount = parseFloat(parsed);
            parsed = args.shift();
            if (!parsed) {
                logger.log('error', `Error parsing the message.`)
                return message.channel.send(`${message.author.toString()} the proper usage would be: ${Configs.command_prefix} \`${this.name} ${this.usage}\``);
            }
            firstunit = parsed;

            parsed = args.shift();
            if (!parsed) {
                logger.log('error', `Error parsing the message.`)
                return message.channel.send(`${message.author.toString()} the proper usage would be: ${Configs.command_prefix} \`${this.name} ${this.usage}\``);
            }
            secondAmount = parseFloat(parsed);
            parsed = args.shift();
            if (!parsed) {
                logger.log('error', `Error parsing the message.`)
                return message.channel.send(`${message.author.toString()} the proper usage would be: ${Configs.command_prefix} \`${this.name} ${this.usage}\``);
            }
            secondunit = parsed;

            if (firstunit === 'feet' && secondunit === 'inches') {
                firstmultiplier = 30.48;
                secondMultiplier = 2.54;
            }
            else {
                return message.channel.send(`${message.author.toString()} the proper usage would be: ${Configs.command_prefix} \`${this.name} ${this.usage}\``);
            }

            const amount = (firstAmount * firstmultiplier + secondAmount & secondMultiplier) / Configs.height;
            const devitos = new Intl.NumberFormat('en-IN').format(amount);

            return message.channel.send(`${message.author.toString()} ${firstAmount} ${firstunit} ${secondMultiplier} ${secondunit} is ${devitos} ${Configs.command_prefix}!`);


        }
        else {
            return message.channel.send(`${message.author.toString()} the proper usage would be: ${Configs.command_prefix} \`${this.name} ${this.usage}\``);
        }

    }
};

export default new Devitos();
