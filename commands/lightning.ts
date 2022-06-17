import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, Message, Guild, Role } from 'discord.js';
import logger from '../tools/logger';
import { Command } from './command';

export class Lightning extends Command {

    guild: Guild;

    constructor(client: Client) {
        super(client, ["lightningbolts", "⚡", "lightingbolts", "lightning_bolts"], false, false, true);

        this.guild = client.guilds.cache.get(Configs.guild_id) as Guild;

    }

    async execute(message: Message, arg: string[]) {

        Stat.findById(Configs.stats_id).then(async stat => {

            if (!stat) {
                return logger.log('error', `[${this.names[0]}]: Error getting the stat, check the stat id`);
            }

            let reply = '';
            if (stat.lightnings.length > 0) {

                reply = 'These are the lightning bolts for this recording:\n\n';

                const number_batches = Math.floor(stat.lightnings.length / 10) + 1;

                for (let index = 0; index < number_batches; index++) {
                    let end = 10 * (index + 1);
                    if (index === number_batches - 1) {
                        end = stat.lightnings.length;
                    }

                    for (let bolt = 10 * index; bolt < end; bolt++) {

                        const author = await message.client.users.fetch(stat.lightnings[bolt].member);
                        const member = await this.guild.members.fetch(stat.lightnings[bolt].member);

                        let house:Role | undefined;
                        house = member.roles.cache.find(role=> role.id === Configs.role_gryffindor || 
                            role.id === Configs.role_ravenclaw ||
                            role.id === Configs.role_hufflepuff ||
                            role.id === Configs.role_ravenclaw);                       
                        
                        if (author) {
                            reply += `${author.toString()}${house?.toString()} asks: ${stat.lightnings[bolt].question}\n`;
                        }

                    }

                    message.channel.send(reply);
                    reply = '';
                }

                logger.log('info', `[${this.names[0]}]: ${stat.lightnings.length} were successfully printed.`);
            }
            else {
                return message.channel.send(`${message.author.toString()} there are no lightning bolts yet, maybe ask the first one!`)
                    .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
            }

        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
    }
};

export default (client: Client) => { return new Lightning(client); }
