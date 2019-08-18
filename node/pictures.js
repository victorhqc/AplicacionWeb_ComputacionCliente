const dotenv = require('dotenv');
const axios = require('axios');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');

const { getPaths } = require('./utils/paths');

dotenv.config();

const UNSPLASH_URL = 'https://api.unsplash.com';
const UNSPLASH_RANDOM_PICTURE = `${UNSPLASH_URL}/photos/random`;


getAndSavePictures(10, 'landscape').catch((e) => {
  throw new Error(e);
});

async function getRandomPictures(count, orientation) {
  const params = querystring.stringify({
    featured: true,
    count: count,
    orientation,
  });

  const { data} = await axios({
    method: 'GET',
    headers: {
      'Accept-Version': 'v1',
      'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
    },
    url: `${UNSPLASH_RANDOM_PICTURE}?${params}`,
  });

  return data;
}

function buildPicturesJson(pictures) {
  return new Promise((resolve, reject) => {
    const { publicPath } = getPaths();

    const json = pictures.map(({
      id,
      description,
      width,
      height,
      color,
      urls,
    }) => ({
      id,
      description,
      width,
      height,
      color,
      url: urls.raw,
    }));

    const stringJson = JSON.stringify(json, undefined, 2);

    fs.writeFile(path.join(publicPath, 'pictures.json'), stringJson, (err) => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
}

async function getAndSavePictures(count, orientation) {
  const pictures = await getRandomPictures(count, orientation);
  await buildPicturesJson(pictures);
}
