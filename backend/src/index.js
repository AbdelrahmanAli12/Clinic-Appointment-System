const express = require('express');
const dotenv = require('dotenv');
const { establishDBConnection } = require('./databaseConnection');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const cors = require('cors');
const usersRoutes = require('./Users/Controller');
const appointmentsRoutes = require('./Appointments/Controller');
const authenticationRoutes = require('./Authentication/Controller');
var http = require('http');
var bodyParser = require('body-parser');

dotenv.config();

const app = express();
const hostname = process.env.HOSTNAME;
const port = process.env.PORT;
app.use(
  bodyParser.json({
    limit: '50mb',
  }),
);
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true,
  }),
);
app.use(express.json());
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/user', usersRoutes);
app.use('/appointments', appointmentsRoutes);
app.use('/auth', authenticationRoutes);

establishDBConnection();

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
