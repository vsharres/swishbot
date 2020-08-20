import { Document, model, Schema, Types } from 'mongoose';

const StatSchema = new Schema({
    recording_date: {
        type: Date,
        default: Date.now
    },
    head_pupils: [{
        member: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        },
    }],
    lightnings: [{
        member: {
            type: String
        },
        question: {
            type: String
        },
    }],
    points: [{
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
    }]

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
}

export interface HeadPupil {
    member: string;
    date: string;
}

interface IStatSchema extends Document {
    recording_date: Date;
    head_pupils: HeadPupil[];
    lightnings: Lightning[];
    points: Houses[]
}

export default model<IStatSchema>("stats", StatSchema);