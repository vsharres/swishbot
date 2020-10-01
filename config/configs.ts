interface Keys {
  mongoURI: string,
  stats_id: string,
  id_eric_munch: string,
  command_prefix: string,
  role_admin: string,
  role_head_pupil: string,
  role_prefect: string,
  role_IT: string,
  channel_recording: string,
  channel_mod_talk: string,
  emoji_dumbly: string,
  emoji_snape: string,
  devito_height: number, // in cm
  devito_weight: number, // in Kg
  channel_house_points: string,
  channel_trophy_room: string,
  role_gryffindor: string,
  role_slytherin: string,
  role_ravenclaw: string,
  role_hufflepuff: string,
  recording_delay: string,
  emoji_addpoints: string[],
  emoji_removepoints: string[],
  gif_peace: string,
  token: string,
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