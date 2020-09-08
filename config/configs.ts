interface Keys {
  mongoURI: string,
  stats_id: string,
  command_prefix: string,
  admin_role_id: string,
  head_pupil_id: string,
  hogwarts_IT_id: string,
  general_channel_id: string,
  binger_gif: string,
  dumbly_emoji: string,
  trelawney_emoji: string,
  snape_emoji: string,
  cedric_emoji: string,
  height: number, // in cm
  weight: number, // in Kg
  house_points_channel: string,
  gryffindor_role: string,
  slytherin_role: string,
  ravenclaw_role: string,
  hufflepuff_role: string,
  recording_delay: string,
  message_chance: string,
  emoji_addpoints: string,
  emoji_removepoints: string,
  tiff_id: string,
  megan_id: string,
  katie_id: string,
  sarah_id: string,
  mia_id: string,
  marchismo_id: string,
  brandon_id: string,
  vini_id: string,
  fletcher_id: string,
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