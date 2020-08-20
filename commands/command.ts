import { Message } from 'discord.js';
import { Logger } from 'winston';

export abstract class Command {
    name: string;
    description: string;
    cooldown: number;
    usage: string;
    args: boolean;
    admin: boolean;
    head_pupil: boolean;
    attachments: boolean;
    attachment_size: number;
    async execute(message: Message, args: string[], logger: Logger): Promise<any> { }

    constructor(name: string,
        description: string,
        cooldown: number,
        usage: string,
        args: boolean = false,
        admin: boolean = false,
        head_pupil: boolean = false,
        attachments: boolean = false,
        attachment_size: number = 0) {

        this.name = name;
        this.description = description;
        this.usage = usage;
        this.description = usage;
        this.cooldown = cooldown;
        this.args = args;
        this.admin = admin;
        this.head_pupil = head_pupil;
        this.attachments = attachments;
        this.attachment_size = attachment_size;
    }
};