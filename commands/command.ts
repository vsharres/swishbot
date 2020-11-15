import { Message } from 'discord.js';

export class Command {
    names: string[];
    description: string;
    cooldown: number;
    usage: string;
    args: boolean;
    admin: boolean;
    prefect: boolean;
    async execute(message: Message, args: string[]): Promise<any> { }

    constructor(names: string[],
        description: string,
        cooldown: number,
        usage: string,
        args: boolean = false,
        admin: boolean = false,
        prefect: boolean = false) {

        this.names = names;
        this.description = description;
        this.usage = usage;
        this.description = usage;
        this.cooldown = cooldown;
        this.args = args;
        this.admin = admin;
        this.prefect = prefect;
    }
};