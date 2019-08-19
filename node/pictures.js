const dotenv = require('dotenv');
const axios = require('axios');
const querystring = require('querystring');
const fs = require('fs-extra');
const path = require('path');

const { getPaths } = require('./utils/paths');

dotenv.config();

const UNSPLASH_URL = 'https://api.unsplash.com';
const UNSPLASH_RANDOM_PICTURE = `${UNSPLASH_URL}/photos/random`;


getAndSavePictures(10, 'landscape').catch((e) => {
  throw new Error(e);
});

async function getAndSavePictures(count, orientation) {
  const pictures = await getRandomPictures(count, orientation);
  await buildPicturesJson(pictures);
  await downloadPictures(pictures);
}

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
    console.log('Building JSON...');
    const { publicPath } = getPaths();

    const json = pictures.map(({ id, description, width, height, color, urls, user }) => ({
      id,
      description,
      width,
      height,
      color,
      url: urls.full,
      author: user.name,
    }));

    const stringJson = JSON.stringify(json, undefined, 2);

    fs.writeFile(path.join(publicPath, 'pictures.json'), stringJson, (err) => {
      if (err) {
        return reject(err);
      }

      console.log('JSON built!');
      return resolve();
    });
  });
}

function downloadPictures(pictures) {
  return new Promise(async (resolve, reject) => {
    console.log('Downloading pictures...');
    const { publicPath } = getPaths();
    const picturesPath = path.join(publicPath, 'pictures');

    if (!fs.existsSync(picturesPath)) {
      fs.mkdirSync(picturesPath);
    } else {
      fs.emptyDirSync(picturesPath);
    }

    for (picture of pictures) {
      await downloadPicture(picture, picturesPath);
    }

    console.log('Pictures downloaded!');
    resolve();
  });
}

function downloadPicture(picture, savePath) {
  return new Promise(async (resolve, reject) => {
    console.log(`Downloading ${picture.urls.full}...`);
    const picturePath = path.resolve(savePath, `${picture.id}.jpg`);
    const writer = fs.createWriteStream(picturePath);
    const response = await axios({
      url: picture.urls.regular,
      method: 'GET',
      responseType: 'stream',
    });

    response.data.pipe(writer);

    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}
