const crypto = require('crypto');
const fs = require('fs');

const envPath = '../.env';

const staticEnv = '# Auto-generated on `npm i` (npm run prepare)\nNODE_ENV=production\nJWT_SECRET=';

const JWT_SECRET = crypto.randomBytes(32).toString('hex');

const env = `${staticEnv}${JWT_SECRET}`;

async function upsertFile(name, dataIfNotFound) {
  const path = `${__dirname}/${name}`;
  fs.writeFile(path, dataIfNotFound, { flag: 'wx' }, (err) => {
    if (err) {
      return;
    }
    console.log('Initiated .env file');
  });
}

upsertFile(envPath, env);
