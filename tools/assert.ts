import { Logger } from 'winston';

function assert(value: any, caller: any, logger: Logger): boolean {

    if (!value) {
        logger.log('error', `[${caller.name}]: Assert fail at ${new Error().stack}`);
        return false;
    }

    return true;
}

export { assert };