import { Client, Guild, GuildMember, Message, VoiceChannel } from 'discord.js';
import logger from '../tools/logger';
import { Handler } from './handler';
import Stat, { Listener } from '../models/Stat';
import Slytherin from '../models/Slytherin';
import { Configs } from '../config/configs';

export class Slyther extends Handler {

    members_houses: Listener[];
    guild: Guild;

    constructor(client: Client) {
        super(client, 'slyther', true);

        this.guild = client.guilds.cache.get(Configs.guild_id) as Guild;
        this.members_houses = [];
    }

    async OnMessage(message: Message) {

        if (message.author.bot) return;

        const secret_command = message.content.toLowerCase();

        const member = message.member as GuildMember;
        const is_prefect = member.roles.cache.has(Configs.role_prefect);
        const is_slytherin = member.roles.cache.has(Configs.role_slytherin);

        if (!is_prefect || !is_slytherin) return;

        switch (secret_command) {
            case 'we are all slytherin':   

                const recording_voice = await this.client.channels.fetch(Configs.channel_voice_recording) as VoiceChannel;

                this.members_houses = [];

                Stat.findById(Configs.stats_id).then((stat) => {

                    if (!stat || recording_voice.members.size === 0) {
                        return logger.log('error', `[${this.name}]: could not find stat or the voice recording channel`);
                    }

                    recording_voice.members.forEach(member => {

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
                            logger.log('info', `[${this.name}]: I'm always slytherin`);

                        })
                        .catch(err => logger.log('error', `[${this.name}]: ${err}`));

                }).catch(err => logger.log('error', `[${this.name}]: ${err}`));

                break;
            case 'https://tenor.com/view/hp-gif-18818544':

               

                Slytherin.findById(Configs.document_slythern).then(async slytherins => {
                    if (!slytherins) {

                        return;
                    }

                    const guild_members = await this.guild.members.fetch();

                    const members_to_message = guild_members.filter(member => member.roles.cache.has(Configs.role_slytherin) && !slytherins.members.includes(member.user.id));

                    if (members_to_message.size === 0) return;

                    members_to_message.forEach(member => {

                        slytherins.members.push(member.user.id);

                        member.createDM().then(channel => {
                            channel.send('Hello there fellow Slytherin! :snake:\n\nThis is your Prefect, Vini speaking.\n\nI\'ve set up a separate **SECRET** server so that all members of the Slytherin house can talk, and maybe set up some shenanigans to do during recordings. :smiling_imp: \n\nhttps://discord.gg/w92YVKNGVG')
                                .catch(err => logger.error(err));
                        })
                            .catch(err => logger.error(err));

                    });

                    slytherins.save()
                        .then(() => {
                            logger.log('info', `[${this.name}]: All the slytherins in the server were invited.`);

                        })
                        .catch(err => logger.log('error', `[${this.name}]: ${err}`));


                })
                break;

        }



    }

};

module.exports = (client: Client) => {
    return new Slyther(client);
}