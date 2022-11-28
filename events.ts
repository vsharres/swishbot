import fs from 'fs';
import path from 'node:path';
import { Event } from './bot-types';
import logger from './tools/logger';
import { Client } from 'discord.js';

export class Events {
    client: Client;

    constructor(client: Client) {
        this.client = client;
        const eventsPath = path.join(__dirname, 'events');
        const handler_files = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

        for (const file of handler_files) {
            const filePath = path.join(eventsPath, file);
            const event = require(filePath)(this.client) as Event;
            if (event.on) {
                this.client.on(event.type, (...args) => event.execute(...args));
            }
            else if (event.once) {
                this.client.once(event.type, (...args) => event.execute(...args));
            }

        }

    }

}
