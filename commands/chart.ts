import { Message, MessageAttachment, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { renderPointsCanvas } from '../tools/chart_points';
import { Command } from './command';

export class Chart extends Command {

    constructor() {
        super(["chart"], true, true, true);
    }

    async execute(message: Message, args: string[],) {

        const configuration = {
            type: 'bar',
            data: {
                labels: [
                    "Gryffindor",
                    "Slytherin",
                    "Ravenclaw",
                    "Hufflepuff",],
                datasets: [{
                    label: 'Points',
                    backgroundColor: ['rgba(174,0,1,1)', 'rgba(76,156,63,1)', 'rgba(57,76,176,1)', 'rgba(241,196,15,1)',],
                    data: [120, 300, 400, 80]
                }]
            }
        };

        const image = await renderPointsCanvas(configuration);

        message.channel.send({
            content: '',
            files: [new MessageAttachment(image)]
        })
    }
};

export default new Chart();