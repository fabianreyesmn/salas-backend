const { app, setupCron } = require('./app');
const { sequelize } = require('./models');
const cron = require('node-cron');

const PORT = process.env.PORT || 3000;

// Execute the cron job setup
setupCron(cron);

// Sinchronize the database and start the server
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
