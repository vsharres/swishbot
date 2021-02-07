import { Client, Message } from 'discord.js';

export class Command {
    client: Client;
    names: string[];
    args: boolean;
    admin: boolean;
    prefect: boolean;
    async execute(message: Message, args: string[]): Promise<any> { }

    constructor(client: Client,
        names: string[],
        args: boolean = false,
        admin: boolean = false,
        prefect: boolean = false) {

        this.client = client;
        this.names = names;
        this.args = args;
        this.admin = admin;
        this.prefect = prefect;
    }
};