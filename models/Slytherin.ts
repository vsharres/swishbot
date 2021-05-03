import { Document, model, Schema } from 'mongoose';

const Slytherin_Schema = new Schema({
    members: [String]
});

interface IStatSchema extends Document {
    members: [String];
}

export default model<IStatSchema>("slytherins", Slytherin_Schema);