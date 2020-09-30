import { Logger } from 'winston';
import { Client } from 'discord.js';

export class Handler {
    name: string;
    description: string;
    client: Client;
    logger: Logger;

    constructor(
        name: string,
        description: string,
        client: Client,
        logger: Logger
    ) {
        this.name = name;
        this.description = description;
        this.client = client;
        this.logger = logger;
    }

    async On() { }
};