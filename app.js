require("dotenv").config();
const axios = require("axios");

const BRIDGE_IP = process.env.BRIDGE_IP;
const USER_ID = process.env.USER_ID;

const ids = {
  office: 12,
  bedroom: 13,
  livingroom: 14,
  desk: 15,
};

const { office, bredroom, livingroom, desk } = ids;

const hues = {
  lightBlue: 39819,
  darkBlue: 47308,
  darkPurple: 48705,
  purple: 49298,
  pink: 52090,
  hotPink: 59487,
  red: 65314,
  bloodOrange: 3032,
  orange: 55910,
  yellow: 9454,
  yellowGreen: 13569,
  green: 20148,
  teal: 32068,
  cyan: 36963,
  random: () => Math.floor(Math.random() * 65535),
};

// Returns a promise that resolves to an object containing the light data
const getLights = async () => {
  const url = `http://${BRIDGE_IP}/api/${USER_ID}/lights`;
  try {
    return await axios.get(url);
  } catch (err) {
    console.error(err);
  }
};

const getLightById = async (name) => {
  const { data } = await getLights();
  //get the light where name === id
  const light = Object.entries(data).filter(([id]) => id == name)[0][1];
  return light;
};

// Control a light by light ID and the desired state
const controlLight = async (light, on, sat, bri, hue) => {
  const url = `http://${BRIDGE_IP}/api/${USER_ID}/lights/${light}/state`;
  try {
    return await axios.put(url, {
      on,
      ...(sat && { sat }),
      ...(bri && { bri }),
      ...(hue && { hue }),
    });
  } catch (err) {
    console.error(err);
  }
};

const controlAllLights = async (on, sat, bri, hue) => {
  Object.values(ids).forEach((id) => {
    controlLight(id, on, sat, bri, hue);
  });
};

const setAllToRandomColor = async (sat = 254, bri = 254) => {
  const randomHue = hues.random();
  controlAllLights(true, sat, bri, randomHue);
};

const setLightToRandomColor = async (id, sat = 254, bri = 254) => {
  const randomHue = hues.random();
  controlLight(id, true, sat, bri, randomHue);
};

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

const spamLightById = async (id, iterations = 10, delay = 1000) => {
  for (let i = 0; i < iterations; i++) {
    setLightToRandomColor(id);
    await timer(delay);
  }
};
