import { Document, model, Schema } from 'mongoose';

const StatSchema = new Schema({
    recording_date: {
        type: Date,
        default: Date.now
    },
    lightnings: [{
        member: {
            type: String
        },
        question: {
            type: String
        },
        votes: {
            type: Number
        },
        was_awarded: {
            type: Boolean,
            default: false
        }
    }],
    house_cups: {
        gryffindor: {
            type: Number
        },
        slytherin: {
            type: Number
        },
        ravenclaw: {
            type: Number
        },
        hufflepuff: {
            type: Number
        }
    },
    points: {
        gryffindor: {
            type: Number
        },
        slytherin: {
            type: Number
        },
        ravenclaw: {
            type: Number
        },
        hufflepuff: {
            type: Number
        }
    }

});

export interface Houses {
    gryffindor: number;
    slytherin: number;
    ravenclaw: number;
    hufflepuff: number;
}

export interface Lightning {
    member: string;
    question: string;
    votes: number;
    was_awarded: boolean;
}


interface IStatSchema extends Document {
    recording_date: Date;
    lightnings: Lightning[];
    house_cups: Houses;
    points: Houses;
}

export default model<IStatSchema>("stats", StatSchema);