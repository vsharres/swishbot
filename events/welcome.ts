import { Client, Events, Guild, GuildMember, Role, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { BotEvent } from '../bot-types';
import { Configs } from '../config/configs';

export class Welcome extends BotEvent {

    channel_come_go: TextChannel;
    channel_sorting: TextChannel;
    channel_welcome: TextChannel;
    role_prefect: Role;

    constructor(client: Client) {
        super(client, 'welcome', Events.GuildMemberAdd, true);

        this.channel_come_go = client.channels.cache.get(Configs.channel_come_go) as TextChannel;
        this.channel_sorting = client.channels.cache.get(Configs.channel_sorting) as TextChannel;
        this.channel_welcome = client.channels.cache.get(Configs.channel_welcome) as TextChannel;
        const guild = client.guilds.cache.get(Configs.guild_id) as Guild;
        this.role_prefect = guild.roles.cache.get(Configs.role_prefect) as Role;

    }

    async execute(member: GuildMember) {

        //Sending a welcome messsage to the come and go channel.
        this.channel_come_go.send(`Welcome ${member.toString()}! Don't forget to sort yourself into a house ${this.channel_sorting.toString()} and check out the ${this.channel_welcome.toString()} channel for info about the different channels ... and if you need help just say ${this.role_prefect.toString()}... and we will do our best to point you in the right direction! <:LGBT:723635019868012545>`);
        logger.log('info', `[${this.name}]: ${member.toString()} added to the server!`);

    }

};

export default (client: Client) => { return new Welcome(client); }