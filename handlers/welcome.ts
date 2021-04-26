import { Client, GuildMember, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { Handler } from './handler';
import { Configs } from '../config/configs';

export class Welcome extends Handler {

    channel_come_go: TextChannel;

    constructor(client: Client) {
        super(client, 'welcome', false, false, true);

        this.channel_come_go = client.channels.cache.get(Configs.channel_come_go) as TextChannel;
    }

    async OnMemberAdd(member: GuildMember) {

        //Only respond to messages from the eric munch bot and to messages in the mod talk channel

        this.channel_come_go.send(`**Welcome ${member.toString()}!** Don't forget to sort yourself into a house #🧙│sorting-hat and check out the #👋│welcome  channel for info about the different channels ... and if you need help just say @Prefects 🔷 ... and we will do our best to point you in the right direction! :LGBT:`);
        logger.log('info', `[${this.name}]: ${member.toString()}`);

    }

};

module.exports = (client: Client) => {
    return new Welcome(client);
}