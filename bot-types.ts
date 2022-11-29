import { Client, ClientOptions, Collection, Message } from "discord.js";

export class BotClient extends Client {
    Commands: Collection<string, Command>

    constructor(options: ClientOptions) {
        super(options);
        this.Commands = new Collection();
    }

}

export abstract class Command {
    client!: Client;
    name: string;

    constructor(client: Client, name: string) {
        this.client = client;
        this.name = name;
    }

    async execute(interaction: any): Promise<any> { }
}

export abstract class BotEvent {
    client: Client;
    name: string;
    type: string;
    once: boolean;
    on: boolean;

    constructor(
        client: Client,
        name: string,
        type: string,
        on: boolean = false,
        once: boolean = false
    ) {
        this.client = client;
        this.name = name;
        this.type = type;
        this.once = once;
        this.on = on;
    }

    async execute(...args: any[]): Promise<any> { }
};