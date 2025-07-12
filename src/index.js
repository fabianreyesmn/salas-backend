const { app, setupCron } = require('./app');
const { sequelize } = require('./models');
const cron = require('node-cron');

const PORT = process.env.PORT || 3000;

// Ejecutar cron job
setupCron(cron);

// Sincronizar y arrancar el servidor
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
