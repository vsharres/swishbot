import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Message, TextChannel, Client, Guild, User } from 'discord.js';
import { printcokes } from '../tools/print_cokes';
import logger from '../tools/logger';
import { Command } from './command';

export class Jinx extends Command {

    cokes_channel: TextChannel;
    guild: Guild;

    constructor(client: Client) {
        super(client, ["jinx"], true, false, true);

        this.cokes_channel = client.channels.cache.get(Configs.channel_cokes) as TextChannel;
        this.guild = client.guilds.cache.get(Configs.guild_id) as Guild;
    }

    //TODO: finish this function
    async execute(message: Message, args: string[]) {

        if (args.length != 2 ) {
            logger.log('warn', `[${this.names[0]}]: To add a jinx we need the name of both of the hosts.`);
            return;
        }

        Stat.findById(Configs.stats_id).then(async stat => {

            if (!stat) {
                logger.log('error', `[${this.names[0]}]: Error to get the stats, check the id`);
                return;
            }

            let messageToSent: any;

            let owes_id = args.shift();
            if (!owes_id) {
                logger.log('error', `[${this.names[0]}]: Error shifting the owning host.`);
                return;
            }

            //remove all but the number to get the user ID
            owes_id = owes_id.replace(/[^a-zA-Z0-9 ]/g, "");
            const owes_is_host = owes_id === Configs.id_megan || owes_id === Configs.id_katie || owes_id === Configs.id_tiff;

            if(!owes_is_host){
                logger.log('warn', `[${this.names[0]}]: To add a jinx only works referencing the hosts`);
                return;
            }

            let owed_id = args.shift();
            if (!owed_id) {
                logger.log('error', `[${this.names[0]}]: Error shifting the owed host.`);
                return;
            }

            //remove all but the number to get the user ID
            owed_id = owed_id.replace(/[^a-zA-Z0-9 ]/g, "");
            const owed_is_host = owed_id === Configs.id_megan || owed_id === Configs.id_katie || owed_id === Configs.id_tiff;
            
            if(!owed_is_host){
                logger.log('warn', `[${this.names[0]}]: To add a jinx only works referencing the hosts`);
                return;
            }

            let cokes = stat.cokes;
            switch (owes_id) {
                case Configs.id_katie:
                    {
                        switch (owed_id) {
                            case Configs.id_megan:
                                --cokes.megan_katie;
                                break;
                            case Configs.id_tiff:
                                --cokes.tiff_katie;
                                break;
                        
                        }
                    }
                    break;
                case Configs.id_megan:
                    {
                        switch (owed_id) {
                            case Configs.id_katie:
                                ++cokes.megan_katie;
                                break;
                            case Configs.id_tiff:
                                --cokes.tiff_megan;
                                break;
                        
                        }
                    }
                    break;
                case Configs.id_tiff:
                    {
                        switch (owed_id) {
                            case Configs.id_megan:
                                ++cokes.tiff_megan;
                                break;
                            case Configs.id_katie:
                                ++cokes.tiff_katie;
                                break;
                        
                        }
                    }
                    break;
            }

            stat.cokes.megan_katie = cokes.megan_katie;
            stat.cokes.tiff_katie = cokes.tiff_katie;
            stat.cokes.tiff_megan = cokes.tiff_megan;

            const owed_member = this.guild.members.cache.get(owed_id);
            const owes_member = this.guild.members.cache.get(owes_id);
            messageToSent = `${owed_member?.toString()} owes a ${Configs.emoji_coke} to ${owes_member?.toString()}!`;

            stat
                .save()
                .then(() => {
                    message.channel
                        .send({
                            content: messageToSent.content,
                            files: messageToSent.files
                        })
                        .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
                })
                .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
            logger.log('info', `[${this.names[0]}]: ${messageToSent.content}`);

            printcokes(this.cokes_channel, stat.cokes, true);
        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
    }
};

export default (client: Client) => { return new Jinx(client); }