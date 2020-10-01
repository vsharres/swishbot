import { Keys } from './configs';

export const keys: Keys = {
	mongoURI: process.env.MONGO_URI ? process.env.MONGO_URI : '',
	stats_id: process.env.STATS_ID ? process.env.STATS_ID : '',
	id_eric_munch: process.env.ERIC_MUNCH_ID ? process.env.ERIC_MUNCH_ID : '',
	command_prefix: process.env.COMMAND_PREFIX ? process.env.COMMAND_PREFIX : '',
	role_admin: process.env.ADMIN_ROLE_ID ? process.env.ADMIN_ROLE_ID : '',
	role_head_pupil: process.env.HEAD_PUPIL ? process.env.HEAD_PUPIL : '',
	role_prefect: process.env.PREFECT_ROLE ? process.env.PREFECT_ROLE : '',
	role_IT: process.env.HOGWARTS_IT ? process.env.HOGWARTS_IT : '',
	channel_recording: process.env.GENERAL_CHANNEL_ID ? process.env.GENERAL_CHANNEL_ID : '',
	channel_mod_talk: process.env.MOD_TALK_CHANNEL ? process.env.MOD_TALK_CHANNEL : '',
	emoji_dumbly: 'https://telegramchannels.me/storage/stickers/boywholived/big_boywholived_17.png',
	emoji_snape: 'https://telegramchannels.me/storage/stickers/boywholived/big_boywholived_2.png',
	devito_height: 147, // in cm
	devito_weight: 48000, // in g
	channel_house_points: process.env.HOUSE_POINTS_CHANNEL ? process.env.HOUSE_POINTS_CHANNEL : '',
	channel_trophy_room: process.env.TROPHY_ROOM_CHANNEL ? process.env.TROPHY_ROOM_CHANNEL : '',
	role_gryffindor: process.env.GRYFFINDOR_ROLE ? process.env.GRYFFINDOR_ROLE : '',
	role_slytherin: process.env.SLYTHERIN_ROLE ? process.env.SLYTHERIN_ROLE : '',
	role_ravenclaw: process.env.RAVENCLAW_ROLE ? process.env.RAVENCLAW_ROLE : '',
	role_hufflepuff: process.env.HUFFLEPUFF_ROLE ? process.env.HUFFLEPUFF_ROLE : '',
	recording_delay: process.env.RECORDING_DELAY ? process.env.RECORDING_DELAY : '',
	emoji_addpoints: ['👍', '👍🏻', '👍🏼', '👍🏽', '👍🏾', '👍🏿'],
	emoji_removepoints: ['👎', '👎🏻', '👎🏼', '👎🏽', '👎🏾', '👎🏿'],
	gif_peace: 'https://tenor.com/view/peace-disappear-vanish-gif-9727828',
	token: process.env.DISCORD_TOKEN ? process.env.DISCORD_TOKEN : ''
}