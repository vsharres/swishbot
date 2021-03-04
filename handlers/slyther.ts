import { Client, Guild, Message, TextChannel, VoiceChannel } from 'discord.js';
import logger from '../tools/logger';
import { Handler } from './handler';
import Stat, { Listener } from '../models/Stat';
import { Configs } from '../config/configs';

export class Slyther extends Handler {

    recording_voice: VoiceChannel;
    members_houses: Listener[];
    guild: Guild;

    constructor(client: Client) {
        super(client, 'slyther', true);

        this.recording_voice = client.channels.cache.get(Configs.channel_voice_recording) as VoiceChannel;
        this.guild = client.guilds.cache.get(Configs.guild_id) as Guild;
        this.members_houses = [];
    }

    async OnMessage(message: Message) {

        const secret_command = message.content.toLowerCase();

        if (secret_command !== 'make it green') return;

        if (message.author.bot) return;

        const admin_member = await this.guild.members.fetch(message.author.id);
        const adminRole = admin_member.roles.cache.has(Configs.role_admin);

        if (adminRole === false) {
            return;
        }

        this.members_houses = [];

        Stat.findById(Configs.stats_id).then((stat) => {

            if (!stat) {
                return;
            }

            if (this.recording_voice.members.size === 0) {
                return;
            }

            this.recording_voice.members.forEach(member => {

                const memberRoles = member.roles.cache;
                let house: string = '';

                memberRoles.forEach(role => {
                    if (Configs.role_gryffindor === role.id ||
                        Configs.role_slytherin === role.id ||
                        Configs.role_ravenclaw === role.id ||
                        Configs.role_hufflepuff === role.id) {
                        house = role.id;
                        member.roles.remove(role.id);
                        member.roles.add(Configs.role_slytherin);
                        return;
                    }
                });

                this.members_houses.push({
                    member: member.id,
                    house: house
                });
            });

            stat.listening_members = this.members_houses;

            stat
                .save()
                .then(() => {
                    logger.log('info', `[${this.name}]: Lightning bolt saved: ${message.content}`);

                })
                .catch(err => logger.log('error', `[${this.name}]: ${err}`));

        }).catch(err => logger.log('error', `[${this.name}]: ${err}`));

    }

};

module.exports = (client: Client) => {
    return new Slyther(client);
}