import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Message, MessageReaction, TextChannel, User } from 'discord.js';
import logger from '../tools/logger';
import { Command } from './command';
import { printPoints } from '../tools/print_points';

export class Snape extends Command {
    constructor() {
        super(["snape", 'poll'], true, false, true);
    }

    async execute(message: Message, args: string[]) {

        //this command only works in the bot talk channel
        if (message.channel.id !== Configs.channel_bot_talk) return;

        const guild = message.guild;
        if (!guild) return;
        const hourglass_channel = <TextChannel>guild.channels.cache.get(Configs.channel_house_points);

        const prefects_role = guild.roles.cache.get(Configs.role_prefect);
        if (!prefects_role) return;

        message.channel.send(`Poll started: ${prefects_role.toString()} we have ${Math.floor(parseInt(Configs.reactions_timer) / 60000)} minutes to vote.`);
        const filter = (reaction: MessageReaction, user: User) => Configs.emoji_addpoints.includes(reaction.emoji.toString()) || Configs.emoji_removepoints.includes(reaction.emoji.toString());
        message.awaitReactions(filter, { time: parseInt(Configs.reactions_timer) })
            .then(collected => {

                const add_emojis_size = collected.filter(reaction => Configs.emoji_addpoints.includes(reaction.emoji.toString())).size;
                const remove_emojis_size = collected.filter(reaction => Configs.emoji_removepoints.includes(reaction.emoji.toString())).size;

                if (remove_emojis_size > add_emojis_size) return;
                else if (remove_emojis_size === add_emojis_size) return;


                Stat.findById(Configs.stats_id).then((stat) => {

                    if (!stat) {
                        logger.log('error', `[${this.names[0]}]: Error to get the stats, check the id`);
                        return;
                    }

                    let points = stat.points;
                    let parsed: string | undefined;
                    let amount = 0;
                    let name = 'Gryffindor 🦁';
                    let messageToSent: any;

                    parsed = args.shift();
                    if (!parsed) {
                        logger.log('error', `[${this.names[0]}]: Error shifting the house.`);
                        return;
                    }
                    let house = parsed;

                    parsed = args.shift();
                    if (!parsed) {
                        logger.log('error', `[${this.names[0]}]: Error shifting the amount.`);
                        return;
                    }

                    amount = parseFloat(parsed);
                    house = house.toLowerCase();

                    switch (house) {
                        case "🦁":
                            points.gryffindor += amount;
                            break;
                        case "gryffindor":
                            points.gryffindor += amount;
                            break;
                        case "🐍":
                            points.slytherin += amount;
                            name = 'Slytherin 🐍';
                            break;
                        case "slytherin":
                            points.slytherin += amount;
                            name = 'Slytherin 🐍';
                            break;
                        case "🦅":
                            points.ravenclaw += amount;
                            name = 'Ravenclaw 🦅';
                            break;
                        case "ravenclaw":
                            points.ravenclaw += amount;
                            name = 'Ravenclaw 🦅';
                            break;
                        case "hufflepuff":
                            points.hufflepuff += amount;
                            name = 'Hufflepuff 🦡';
                            break;
                        case "🦡":
                            points.hufflepuff += amount;
                            name = 'Hufflepuff 🦡';
                            break;
                        default:
                            logger.log('error', `[${this.names[0]}]: The house could not be parsed.`);
                            return;

                    }

                    messageToSent = {
                        content: `**${amount} points** ${amount > 0 ? 'to' : 'from'} ${name}!!`
                    };

                    stat.points = points;

                    stat
                        .save()
                        .then(() => {
                            message.channel
                                .send({
                                    content: messageToSent.content
                                })
                                .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
                        })
                        .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
                    logger.log('info', `[${this.names[0]}]: ${messageToSent.content}`);

                    printPoints(hourglass_channel, points, true);

                })
                    .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));

            })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));

    }
}

export default new Snape();