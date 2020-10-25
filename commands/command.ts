import { Message } from 'discord.js';
import { Logger } from 'winston';

export class Command {
    names: string[];
    description: string;
    cooldown: number;
    usage: string;
    args: boolean;
    admin: boolean;
    prefect: boolean;
    attachments: boolean;
    attachment_size: number;
    async execute(message: Message, args: string[], logger: Logger): Promise<any> { }

    constructor(names: string[],
        description: string,
        cooldown: number,
        usage: string,
        args: boolean = false,
        admin: boolean = false,
        prefect: boolean = false,
        attachments: boolean = false,
        attachment_size: number = 0) {

        this.names = names;
        this.description = description;
        this.usage = usage;
        this.description = usage;
        this.cooldown = cooldown;
        this.args = args;
        this.admin = admin;
        this.prefect = prefect;
        this.attachments = attachments;
        this.attachment_size = attachment_size;
    }
};