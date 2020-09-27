import { Logger } from 'winston';
import { Client } from 'discord.js';

export class Handler {
    description: string;
    client: Client;
    logger: Logger;

    constructor(
        description: string,
        client: Client,
        logger: Logger
    ) {

        this.description = description;
        this.client = client;
        this.logger = logger;
    }

    async On() { }
};