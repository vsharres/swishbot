import { Document, model, Schema } from 'mongoose';

const ArrayAuthors = new Schema({
    authors: [String],


}, { _id: false });

const StatSchema = new Schema({
    likes: {
        type: Map,
        of: ArrayAuthors
    },
    funnies: [{
        message_id: {
            type: String
        },
        channel_id: {
            type: String
        }
    }],
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

export interface AuthorsArray {
    authors: string[]
}

export interface LikedMessage {
    _id: string;
    message_id: string;
}

export interface Lightning {
    member: string;
    question: string;
    votes: number;
    was_awarded: boolean;
}

export interface Funny {
    message_id: string;
    channel_id: string;
}

interface IStatSchema extends Document {
    lightnings: Lightning[];
    funnies: Funny[];
    house_cups: Houses;
    points: Houses;
    likes: Map<string, AuthorsArray>;
}

export default model<IStatSchema>("stats", StatSchema);