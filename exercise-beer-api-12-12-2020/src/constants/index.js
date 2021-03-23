const SERVER_PORT = 3000;

const BEERS_DB = 'src/db/beers.json';

const ERROR_500 = {
  success: false,
  message: 'something went wrong',
};

module.exports = {
  SERVER_PORT,
  BEERS_DB,
  ERROR_500,
};
