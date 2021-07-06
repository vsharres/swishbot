import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, Guild, Message, Role, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { Command } from './command';
import { printcups } from '../tools/print_cups';

export class Award extends Command {

    trophy_channel: TextChannel;
    recording_channel: TextChannel;
    guild: Guild;

    constructor(client: Client) {
        super(client, ["award_cup", "winner"], true, false, true);

        this.trophy_channel = client.channels.cache.get(Configs.channel_trophy_room) as TextChannel;
        this.recording_channel = client.channels.cache.get(Configs.channel_recording) as TextChannel;
        this.guild = client.guilds.cache.get(Configs.guild_id) as Guild;
    }

    async execute(message: Message, args: string[],) {

        if (args.length !== 1 || !isNaN(parseFloat(args[0]))) {
            logger.log('error', `[${this.names[0]}]: Incorrect usage.`);
            return;
        }

        Stat.findById(Configs.stats_id).then((stat) => {

            if (!stat) {
                logger.log('error', `[${this.names[0]}]: Error to get the stats, check the id`);
                return;
            }

            let house = args.shift();
            if (!house) {
                logger.log('error', `[${this.names[0]}]: Error shifting the house.`);
                return;
            }
            house = house.toLowerCase();

            let name = '🦁';
            let cups = stat.house_cups;
            let house_role = this.guild.roles.cache.get(Configs.role_gryffindor) as Role;

            switch (house) {
                case 'gryffindor':
                    cups.gryffindor++;
                    break;
                case '🦁':
                    cups.gryffindor++;
                    break;
                case 'slytherin':
                    cups.slytherin++;
                    name = '🐍';
                    house_role = this.guild.roles.cache.get(Configs.role_slytherin) as Role;
                    break;
                case '🐍':
                    cups.slytherin++;
                    name = '🐍';
                    house_role = this.guild.roles.cache.get(Configs.role_slytherin) as Role;
                    break;
                case '🦅':
                    cups.ravenclaw++;
                    house_role = this.guild.roles.cache.get(Configs.role_ravenclaw) as Role;
                    name = '🦅';
                    break;
                case 'ravenclaw':
                    cups.ravenclaw++;
                    name = '🦅';
                    house_role = this.guild.roles.cache.get(Configs.role_ravenclaw) as Role;
                    break;
                case 'hufflepuff':
                    cups.hufflepuff++;
                    name = '🦡';
                    house_role = this.guild.roles.cache.get(Configs.role_hufflepuff) as Role;
                    break;
                case '🦡':
                    cups.hufflepuff++;
                    name = '🦡';
                    house_role = this.guild.roles.cache.get(Configs.role_hufflepuff) as Role;
                    break;
                default:
                    logger.log('error', `[${this.names[0]}]: Incorrect usage.`);
                    return;
            }

            stat.house_cups = cups;

            printcups(this.trophy_channel, cups, true);

            stat
                .save()
                .then(() => {
                    this.recording_channel
                        .send(`Congratulations! The house cup for this recording goes to **${house_role.toString()} ${name}!** \n`)
                        .then(() => logger.log('info', `[${this.names[0]}]: The house cup for this recording goes to **${house_role.toString()} ${name}!** \n`))
                        .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
                })
                .catch(err => logger.log('error', err));

        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
    }
};

export default (client: Client) => { return new Award(client); }