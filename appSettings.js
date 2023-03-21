require('dotenv').config();

const settings = {
  'clientId': process.env.CLIENTID,
  'tenantId': process.env.TENANTID,
  'graphUserScopes': [
    'user.read',
    'files.read',
    'files.read.all'
  ]
};

module.exports = settings;