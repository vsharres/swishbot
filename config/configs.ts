interface Keys {
  mongoURI: string,
  stats_id: string,
  eric_munch_id: string,
  command_prefix: string,
  role_admin: string,
  role_prefect: string,
  role_IT: string,
  channel_recording: string,
  channel_mod_talk: string,
  channel_bot_talk: string,
  channel_banned: string,
  channel_voice_recording: string,
  channel_noticeboard: string,
  channel_polls: string,
  channel_wheezes: string,
  channel_house_points: string,
  channel_trophy_room: string,
  channel_come_go: string,
  channel_welcome: string,
  channel_sorting: string,
  channel_cokes: string,
  chaos: boolean,
  devito_height: number, // in cm
  devito_weight: number, // in Kg
  document_slythern: string,
  guild_id: string,
  id_megan: string,
  id_katie: string,
  id_tiff: string,
  role_gryffindor: string,
  role_slytherin: string,
  role_ravenclaw: string,
  role_hufflepuff: string,
  role_phoenix: string,
  role_unicorn: string,
  role_patron: string,
  role_dragon: string,
  role_hippogriff: string,
  role_phoenix_emoji: string,
  role_ageline: string,
  emoji_addpoints: string[],
  emoji_removepoints: string[],
  emoji_wheeze: string,
  emoji_coke: string,
  emojis_vote_yes: string[],
  emojis_vote_no: string[],
  emojis_negative_reactions: string[],
  slytherin_points_multiplier: number,
  slytherin_felix_chance: number, // 0-100
  ravenclaw_points_multiplier: number,
  ravenclaw_felix_chance: number, // 0-100
  gryffindor_points_multiplier: number,
  gryffindor_felix_chance: number, // 0-100
  hufflepuff_points_multiplier: number,
  hufflepuff_felix_chance: number, // 0-100
  points_zap_votes: number,
  points_votes: number,
  points_likes: number,
  number_reactions: number,
  gif_peace: string,
  token: string
}

let Configs: Keys;

if (process.env.NODE_ENV === "production") {
  const ProdKeys = require(`./config_prod`);
  Configs = ProdKeys.keys;
} else {
  const DevKeys = require(`./config_dev`);
  Configs = DevKeys.keys;
}

export { Keys, Configs }