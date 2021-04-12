import Stat, { Option } from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, Message, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { Command } from './command';

export class StartPoll extends Command {

    polls_channel: TextChannel;
    recording_channel: TextChannel;

    constructor(client: Client) {
        super(client, ["make_poll", "start_poll"], true, false, true);

        this.polls_channel = client.channels.cache.get(Configs.channel_polls) as TextChannel;
        this.recording_channel = client.channels.cache.get(Configs.channel_recording) as TextChannel;
    }

    async execute(message: Message, arg: string[]) {

        if (!arg[0].startsWith('"')) {
            //add error message
            return;
        }

        let description_end = false;
        let description = '';

        while (!description_end) {
            let word = arg.shift();
            description += `${word} `;

            if (word?.endsWith('"')) {
                description_end = true;
            }

        }

        description = description.replace('"', '');
        description = description.replace('"', '');
        const prompt = `**POLL\n\nVote by reacting to one of the emojis:**\n\n${description}`;

        const options_count = arg.length;
        let options = new Array<Option>();

        for (let index = 0; index < options_count; index++) {
            options.push({ emoji_id: arg[index], votes: { gryffindor: 0, slytherin: 0, ravenclaw: 0, hufflepuff: 0 } });

        }

        Stat.findById(Configs.stats_id).then((stat) => {
            if (!stat) {
                return logger.log('error', `[${this.names[0]}]: Error getting the stat, check the stat id`);
            }

            this.polls_channel.send(prompt)
                .then((message) => {

                    stat.polls.push({
                        poll_id: message.id,
                        question: description,
                        options: options,
                        voters: []
                    });

                    options.forEach(option => {
                        message.react(option.emoji_id);
                    })

                    stat.save().then(() => {
                        logger.log('info', `[${this.names[0]}]: Poll added!`);
                        this.recording_channel.send(`@here **A new poll started! \n\nGo to the ${this.polls_channel.toString()} channel and vote!**`);

                    })
                        .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));

                });

        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
    }
};

export default (client: Client) => { return new StartPoll(client); }