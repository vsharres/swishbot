import { model, Schema } from 'mongoose';

const ArrayAuthors = new Schema({
    authors: [String],

}, { _id: false });

const StatSchema = new Schema({
    likes: {
        type: Map,
        of: ArrayAuthors
    },
    list: [String],
    annoying_users: [String],
    cokes: {
        tiff_megan: {
            type: Number
        },
        tiff_katie: {
            type: Number
        },
        megan_katie: {
            type: Number
        }
    },
    polls: [{
        poll_id: {
            type: String
        },
        question: {
            type: String
        },
        voters: [String],
        options: [{
            emoji_id: {
                type: String
            },
            votes: {
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
        }]
    }],
    listening_members: [{
        member: {
            type: String
        },
        house: {
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

export interface Option {
    emoji_id: string;
    votes: Houses;
}

export interface Poll {
    poll_id: string;
    question: string;
    voters: string[];
    options: Option[];
}

export interface Listener {
    member: string;
    house: string;
}

export interface AuthorsArray {
    authors: string[];
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

export interface Cokes {
    tiff_megan: number;
    tiff_katie: number;
    megan_katie: number;
}

interface Stats {
    lightnings: Lightning[];
    listening_members: Listener[];
    polls: Poll[];
    house_cups: Houses;
    points: Houses;
    cokes: Cokes;
    likes: Map<string, AuthorsArray>;
    annoying_users: string[];
    list: string[];
}


export default model<Stats>("stats", StatSchema);