import { TextChannel } from 'discord.js'
import logger from './logger';
import { Cokes } from '../models/Stat';
import { Configs } from '../config/configs';

async function printcokes(channel: TextChannel, cokes: Cokes, is_print_channel: boolean = false) {

    const start_time = Date.now();

    let reply = `**Disney Cokes Tally ${Configs.emoji_coke}!**\n\n`;

    let sorted_cokes = [{
        owes: cokes.megan_katie > 0 ? `<@${Configs.id_megan}>` : `<@${Configs.id_katie}`,
        owed: cokes.megan_katie > 0 ? `<@${Configs.id_katie}>` : `<@${Configs.id_megan}`,
        value: cokes.megan_katie
    }, {
        owes: cokes.tiff_katie > 0 ? `<@${Configs.id_tiff}>` : `<@${Configs.id_katie}`,
        owed: cokes.tiff_katie > 0 ? `<@${Configs.id_katie}>` : `<@${Configs.id_tiff}`,
        value: cokes.tiff_katie
    },
    {
        owes: cokes.tiff_megan > 0 ? `<@${Configs.id_tiff}>` : `<@${Configs.id_megan}`,
        owed: cokes.tiff_megan > 0 ? `<@${Configs.id_megan}>` : `<@${Configs.id_tiff}`,
        value: cokes.tiff_megan
    }];

    sorted_cokes.sort((a, b) => b.value - a.value);

    sorted_cokes.forEach((coke) => {

        if(coke.value === 0){
            reply += `${coke.owes} and ${coke.owed} are **square!**\n`;
        }
        else{
            reply += `${coke.owes} owes **${Math.abs(coke.value)} ${Configs.emoji_coke}** to ${coke.owed}\n`;
        }
    })

    if (is_print_channel) {

        const messages = await channel.messages.fetch();
        const message = messages.first();
        if (!message) {
            logger.log('error', 'Could not find the message for the cups.');
            return;
        }

        message.edit(reply)
            .then(() => {
                const end_time = Date.now();
                logger.log('info', `Time to execute: ${end_time - start_time} ms`);
            })
            .catch(error => logger.log('error', error));
    }
    else {
        channel.send(reply)
            .catch(error => logger.log('error', error));
    }

}

export { printcokes }