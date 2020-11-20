import logger from 'winston';

function assert(value: any, caller: any): boolean {

    if (!value) {
        logger.log('error', `[${caller.name}]: Assert fail at ${value}`);
        return false;
    }

    return true;
}

export { assert };