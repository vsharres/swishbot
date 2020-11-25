import { Message } from 'discord.js';

export class Command {
    names: string[];
    args: boolean;
    admin: boolean;
    prefect: boolean;
    async execute(message: Message, args: string[]): Promise<any> { }

    constructor(names: string[],
        args: boolean = false,
        admin: boolean = false,
        prefect: boolean = false) {

        this.names = names;
        this.args = args;
        this.admin = admin;
        this.prefect = prefect;
    }
};