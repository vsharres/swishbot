import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Message, User, MessageReaction, TextChannel } from 'discord.js';
import { Logger } from 'winston';
import { Command } from './command';

export class Head extends Command {

    constructor() {
        super("head", 'Polls users to be the next head pupil', 1, '', false, true);
    }

    async execute(message: Message, args: string[], logger: Logger) {


        Stat.findById(Configs.stats_id).then(async (stat) => {
            if (!stat) return;

            const previous_heads = stat.head_pupils;
            let next_house = {
                name: 'Hufflepuff 🦡',
                id: ''
            };

            const recording_chat = message.client.channels.cache.get(Configs.general_channel_id) as TextChannel;

            if (previous_heads.length > 0) {
                const last_head = message.guild?.members.cache.get(previous_heads[previous_heads.length - 1].member);
                const last_house = last_head?.roles.cache.filter(role => role.id === Configs.slytherin_role || role.id === Configs.gryffindor_role || role.id === Configs.ravenclaw_role || role.id === Configs.hufflepuff_role).first();

                switch (last_house?.id) {
                    case Configs.gryffindor_role:
                        next_house.name = 'Hufflepuff 🦡';
                        next_house.id = Configs.hufflepuff_role;
                        break;
                    case Configs.ravenclaw_role:
                        next_house.name = 'Slytherin 🐍';
                        next_house.id = Configs.slytherin_role;
                        break;
                    case Configs.slytherin_role:
                        next_house.name = 'Gryffindor 🦁';
                        next_house.id = Configs.gryffindor_role;
                        break;
                    case Configs.hufflepuff_role:
                        next_house.name = 'Ravenclaw 🦅';
                        next_house.id = Configs.ravenclaw_role;
                        break;
                }

            }


            const filter = (reaction: MessageReaction, user: User) => {
                const member = message.guild?.members.cache.get(user.id);
                const from_house = member?.roles.cache.has(next_house.id) ? true : false;
                const not_previous_head = !previous_heads.some(head => head.member === user.id);

                return reaction.emoji.name === '✋' && not_previous_head && from_house;
            };


            recording_chat
                .send(`Command to poll users who want to be the Head pupil for this recording: /n/n${next_house.name}`)
                .then(poll => {

                    poll.awaitReactions(filter, { max: 100, time: 60000, errors: ['time'] })
                        .then(async (collected) => {

                            const users = collected.keyArray;



                        })
                        .catch((collected) => {

                        });

                })
                .catch(err => logger.log('error', err));


        })
            .catch(err => logger.log('error', err));
    }

};

export default new Head();
