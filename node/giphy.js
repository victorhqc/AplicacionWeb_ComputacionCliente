const dotenv = require('dotenv');
const axios = require('axios');
const querystring = require('querystring');
const fs = require('fs-extra');
const path = require('path');

const { getPaths } = require('./utils/paths');

dotenv.config();

const GIPHY_URL = 'https://api.giphy.com/v1';

buildGiphyJson().catch((e) => {
  throw new Error(e);
});

function buildGiphyJson() {
  return new Promise((resolve, reject) => {
    console.log('Building JSON...');
    const { publicPath } = getPaths();

    const stringJson = JSON.stringify({
      giphy_url: GIPHY_URL,
      giphy_key: process.env.GIPHY_KEY,
    }, undefined, 2);

    fs.writeFile(path.join(publicPath, 'giphy.json'), stringJson, (err) => {
      if (err) {
        return reject(err);
      }

      console.log('JSON built!');
      return resolve();
    });
  });
}
