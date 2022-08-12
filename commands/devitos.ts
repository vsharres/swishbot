import { Configs } from '../config/configs';
import { Units } from '../config/units';
import { Client, Message } from 'discord.js'
import logger from '../tools/logger';
import { Command } from './command';

export class Devitos extends Command {

    constructor(client: Client) {
        super(client, ["convert"], true);
    }

    async execute(message: Message, args: string[]) {

        //for the usage of having only on number on the args
        if (args.length === 1) {
            let parsed = args.shift();
            let multiplier = 1;
            let divisor = Configs.devito_height;
            //Need to replace the regex so that . can be parsed out
            if (!parsed) {
                logger.log('error', `[${this.names[0]}]: Error parsing the message.`)
                return;
            }

            let unit = parsed.replace(/[0-9]/g, '').toLowerCase();
            //for the special case of using ' or "
            const rex = /^(?!$|.*\'[^\x22]+$)(?:(\d+(?:.\d+)?)\')?(?:(\d+(?:.\d+)?)\x22?)?$/;
            const match = rex.exec(parsed);
            if (match) {
                let feet = parseFloat(match[1]) ? parseFloat(match[1]) : 0;
                let inches = parseFloat(match[2]) ? parseFloat(match[2]) : 0;

                const devitos = (((feet * 30.48) + (inches * 2.54)) / divisor);
                const devitos_string = new Intl.NumberFormat('en-US', { style: 'decimal' }).format(devitos);
                const string_feet = new Intl.NumberFormat('en-US', { style: 'decimal' }).format(feet);
                const string_inches = new Intl.NumberFormat('en-US', { style: 'decimal' }).format(inches);
                const message_to_send = `${message.author.toString()} ${feet > 0 ? string_feet + "'" : ''}${inches > 0 ? string_inches + '"' : ''} is ${devitos_string} ${Configs.command_prefix}!`;
                return message.channel.send(message_to_send)
                    .then(() => logger.log('info', message_to_send))
                    .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));

            }

            const Unit = Units.get(unit);
            if (!Unit) {
                return;
            }
            multiplier = Unit.multiplier;
            divisor = Unit.divisor;

            parsed = parsed.substring(0, parsed.length - unit.length);
            const amount = parseFloat(parsed);
            const devitos = (amount * multiplier / divisor);
            const devitos_string = new Intl.NumberFormat('en-US', { style: 'decimal' }).format(devitos);
            const string_amount = new Intl.NumberFormat('en-US', { style: 'decimal' }).format(amount);
            const message_to_send = `${message.author.toString()} ${string_amount} ${unit} is ${devitos_string} ${Configs.command_prefix}!`;

            return message.channel.send(message_to_send)
                .then(() => logger.log('info', message_to_send))
                .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));


        }
        //for more than one arg in the command, as if the unit is separate from the number
        else if (args.length == 2 && !isNaN(parseFloat(args[0]))) {
            const parsed = args.shift();
            let multiplier = 1;
            let divisor = Configs.devito_height;
            if (!parsed) {
                logger.log('error', `Error parsing the message.`)
                return;
            }

            let amount = parseFloat(parsed);
            let unit = args.shift();
            if (!unit) {
                return;
            }

            const Unit = Units.get(unit);
            if (!Unit) {
                return;
            }
            multiplier = Unit.multiplier;
            divisor = Unit.divisor;

            const devitos = (amount * multiplier / divisor);
            const string_devitos = new Intl.NumberFormat('en-US', { style: 'decimal' }).format(devitos);
            const string_amount = new Intl.NumberFormat('en-US', { style: 'decimal' }).format(amount);
            const message_to_send = `${message.author.toString()} ${string_amount} ${unit} is ${string_devitos} ${Configs.command_prefix}!`;

            return message.channel.send(message_to_send)
                .then(() => logger.log('info', message_to_send))
                .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));

        }
        else if (args.length === 4 && !isNaN(parseFloat(args[0])) && !isNaN(parseFloat(args[2]))) {
            let firstAmount = 0;
            let secondAmount = 0;
            let firstmultiplier = 1;
            let secondMultiplier = 1;
            let firstunit = 'feet';
            let secondunit = 'inches';
            let parsed = args.shift();
            let divisor = Configs.devito_height;
            if (!parsed) {
                logger.log('error', `[${this.names[0]}]: Error parsing the message.`);
                return;
            }

            firstAmount = parseFloat(parsed);
            parsed = args.shift();
            if (!parsed) {
                logger.log('error', `[${this.names[0]}]: Error parsing the message.`);
                return;
            }

            firstunit = parsed;
            parsed = args.shift();
            if (!parsed) {
                logger.log('error', `[${this.names[0]}]: Error parsing the message.`);
                return;
            }

            secondAmount = parseFloat(parsed);
            parsed = args.shift();
            if (!parsed) {
                logger.log('error', `[${this.names[0]}]: Error parsing the message.`);
                return;
            }

            secondunit = parsed;
            if (firstunit === 'feet' && secondunit === 'inches' || secondunit === 'inch') {
                firstmultiplier = 30.48;
                secondMultiplier = 2.54;
            }
            else {
                logger.log('error', `[${this.names[0]}]: The first unit and the second unit were not feet and inches`);
                return;
            }

            const amount = (firstAmount * firstmultiplier + secondAmount * secondMultiplier) / divisor;
            const devitos = new Intl.NumberFormat('en-US').format(amount);
            const string_firstamount = new Intl.NumberFormat('en-US', { style: 'decimal' }).format(firstAmount);
            const string_secondamount = new Intl.NumberFormat('en-US', { style: 'decimal' }).format(secondAmount);
            const message_to_send = `${message.author.toString()} ${string_firstamount} ${firstunit} ${string_secondamount} ${secondunit} is ${devitos} ${Configs.command_prefix}!`;

            return message.channel.send(message_to_send)
                .then(() => logger.log('info', message_to_send))
                .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));


        }

    }
};

export default (client: Client) => { return new Devitos(client); }
