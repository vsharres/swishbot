import { Client, GuildMember, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { Handler } from './handler';
import { Configs } from '../config/configs';

export class Welcome extends Handler {

    channel_come_go: TextChannel;
    channel_sorting: TextChannel;
    channel_welcome: TextChannel;

    constructor(client: Client) {
        super(client, 'welcome', false, false, true);

        this.channel_come_go = client.channels.cache.get(Configs.channel_come_go) as TextChannel;
        this.channel_sorting = client.channels.cache.get(Configs.channel_sorting) as TextChannel;
        this.channel_welcome = client.channels.cache.get(Configs.channel_welcome) as TextChannel;
    }

    async OnMemberAdd(member: GuildMember) {

        //Sending a welcome messsage to the come and go channel.
        this.channel_come_go.send(`**Welcome ${member.toString()}!** Don't forget to sort yourself into a house ${this.channel_sorting.toString()} and check out the ${this.channel_welcome.toString()} channel for info about the different channels ... and if you need help just say @Prefects 🔷 ... and we will do our best to point you in the right direction! :LGBT:`);
        logger.log('info', `[${this.name}]: ${member.toString()} added to the server!`);

    }

};

module.exports = (client: Client) => {
    return new Welcome(client);
}