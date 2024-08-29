// src/index.js
const logger= require("./utils/logger")
const { sequelize } = require('./models/index');

sequelize.sync({ force: false }).then(() => {
  logger.info('Database & tables created!');
});

