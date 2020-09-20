import { Configs } from '../config/configs';
import { Units } from '../config/units';
import { Message } from 'discord.js'
import { Logger } from 'winston';
import { Command } from './command';

export class Devitos extends Command {

    constructor() {
        super(["convert"], 'Converts the provided number to devitos', 10, '<amount> <type>', true);
    }

    async execute(message: Message, args: string[], logger: Logger) {

        //for the usage of having only on number on the args
        if (args.length === 1) {
            let parsed = args.shift();
            let multiplier = 1;
            let divisor = Configs.height;
            //Need to replace the regex so that . can be parsed out
            if (!parsed) {
                logger.log('error', `Error parsing the message.`)
                return message.channel.send(`${message.author.toString()} the proper usage would be: ${Configs.command_prefix} \`${this.names} ${this.usage}\``)
                    .catch(err => logger.log('error', err));
            }

            let unit = parsed.replace(/[0-9]/g, '').toLowerCase();
            //for the special case of using ' or "
            const rex = /^(?!$|.*\'[^\x22]+$)(?:(\d+(?:.\d+)?)\')?(?:(\d+(?:.\d+)?)\x22?)?$/;
            const match = rex.exec(parsed);
            if (match) {
                let feet = parseFloat(match[1]) ? parseFloat(match[1]) : 0;
                let inches = parseFloat(match[2]) ? parseFloat(match[2]) : 0;

                const devitos = (((feet * 30.48) + (inches * 2.54)) / divisor);
                const devitos_string = new Intl.NumberFormat('en-IN').format(devitos);
                const string_feet = new Intl.NumberFormat('en-IN').format(feet);
                const string_inches = new Intl.NumberFormat('en-IN').format(inches);
                return message.channel.send(`${message.author.toString()} ${feet > 0 ? string_feet + "'" : ''}${inches > 0 ? string_inches + '"' : ''} is ${devitos_string} ${Configs.command_prefix}!`)
                    .catch(err => logger.log('error', err));

            }

            const Unit = Units.get(unit);
            if (!Unit) {
                return message.channel.send(`${message.author.toString()} the proper usage would be: ${Configs.command_prefix} \`${this.names} ${this.usage}\``)
                    .catch(err => logger.log('error', err));
            }
            multiplier = Unit.multiplier;
            divisor = Unit.divisor;

            parsed = parsed.substring(0, parsed.length - unit.length);
            const amount = parseFloat(parsed);
            const devitos = (amount * multiplier / divisor);
            const devitos_string = new Intl.NumberFormat('en-IN').format(devitos);
            const string_amount = new Intl.NumberFormat('en-IN').format(amount);

            return message.channel.send(`${message.author.toString()} ${string_amount} ${unit} is ${devitos_string} ${Configs.command_prefix}!`)
                .catch(err => logger.log('error', err));


        }
        //for more than one arg in the command, as if the unit is separate from the number
        else if (args.length == 2 && !isNaN(parseFloat(args[0]))) {
            const parsed = args.shift();
            let multiplier = 1;
            let divisor = Configs.height;
            if (!parsed) {
                logger.log('error', `Error parsing the message.`)
                return message.channel.send(`${message.author.toString()} the proper usage would be: ${Configs.command_prefix} \`${this.names} ${this.usage}\``)
                    .catch(err => logger.log('error', err));
            }

            let amount = parseFloat(parsed);
            let unit = args.shift();
            if (!unit) {
                return message.channel.send(`${message.author.toString()} the proper usage would be: ${Configs.command_prefix} \`${this.names} ${this.usage}\``)
                    .catch(err => logger.log('error', err));
            }

            const Unit = Units.get(unit);
            if (!Unit) {
                return message.channel.send(`${message.author.toString()} the proper usage would be: ${Configs.command_prefix} \`${this.names} ${this.usage}\``)
                    .catch(err => logger.log('error', err));
            }
            multiplier = Unit.multiplier;
            divisor = Unit.divisor;

            const devitos = (amount * multiplier / divisor);
            const string_devitos = new Intl.NumberFormat('en-IN').format(devitos);
            const string_amount = new Intl.NumberFormat('en-IN').format(amount);

            return message.channel.send(`${message.author.toString()} ${string_amount} ${unit} is ${string_devitos} ${Configs.command_prefix}!`);

        }
        else if (args.length === 4 && !isNaN(parseFloat(args[0])) && !isNaN(parseFloat(args[2]))) {
            let firstAmount = 0;
            let secondAmount = 0;
            let firstmultiplier = 1;
            let secondMultiplier = 1;
            let firstunit = 'feet';
            let secondunit = 'inches';
            let parsed = args.shift();
            let divisor = Configs.height;
            if (!parsed) {
                logger.log('error', `Error parsing the message.`)
                return message.channel.send(`${message.author.toString()} the proper usage would be: ${Configs.command_prefix} \`${this.names} ${this.usage}\``);
            }

            firstAmount = parseFloat(parsed);
            parsed = args.shift();
            if (!parsed) {
                logger.log('error', `Error parsing the message.`)
                return message.channel.send(`${message.author.toString()} the proper usage would be: ${Configs.command_prefix} \`${this.names} ${this.usage}\``);
            }
            firstunit = parsed;

            parsed = args.shift();
            if (!parsed) {
                logger.log('error', `Error parsing the message.`)
                return message.channel.send(`${message.author.toString()} the proper usage would be: ${Configs.command_prefix} \`${this.names} ${this.usage}\``);
            }
            secondAmount = parseFloat(parsed);
            parsed = args.shift();
            if (!parsed) {
                logger.log('error', `Error parsing the message.`)
                return message.channel.send(`${message.author.toString()} the proper usage would be: ${Configs.command_prefix} \`${this.names} ${this.usage}\``);
            }
            secondunit = parsed;

            if (firstunit === 'feet' && secondunit === 'inches') {
                firstmultiplier = 30.48;
                secondMultiplier = 2.54;
            }
            else {
                return message.channel.send(`${message.author.toString()} the proper usage would be: ${Configs.command_prefix} \`${this.names} ${this.usage}\``);
            }

            const amount = (firstAmount * firstmultiplier + secondAmount * secondMultiplier) / divisor;
            const devitos = new Intl.NumberFormat('en-IN').format(amount);
            const string_firstamount = new Intl.NumberFormat('en-IN').format(firstAmount);
            const string_secondamount = new Intl.NumberFormat('en-IN').format(secondAmount);

            return message.channel.send(`${message.author.toString()} ${string_firstamount} ${firstunit} ${string_secondamount} ${secondunit} is ${devitos} ${Configs.command_prefix}!`);


        }
        else {
            return message.channel.send(`${message.author.toString()} the proper usage would be: ${Configs.command_prefix} \`${this.names} ${this.usage}\``);
        }

    }
};

export default new Devitos();
