import { model, Schema } from 'mongoose';

const Slytherin_Schema = new Schema({
    members: [String]
});

interface Slytherin {
    members: [String];
}

export default model<Slytherin>("slytherins", Slytherin_Schema);