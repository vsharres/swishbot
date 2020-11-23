import { Collection } from 'discord.js'

export class Profiler {

    profilers: Collection<string, number>;

    constructor() {
        this.profilers = new Collection<string, number>();
    }

    startTimer(id: string) {
        let time = Date.now();

        this.profilers.set(id, time);
    }

    endTimer(id: string): number {
        let timer = this.profilers.get(id);
        if (timer) {
            timer = Date.now() - timer;
            this.profilers.set(id, timer);

            return timer;
        }

        return 0;
    }

}

export default new Profiler();
