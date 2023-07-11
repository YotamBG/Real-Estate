if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const session = require('express-session');
const db = require('./utils/db');
const bodyParser = require('body-parser');
const passport = require('passport');
const initializePassport = require('./utils/passport-config');
var cors = require('cors');
var fileUpload = require('express-fileupload');
require("./utils/auth-config");


const app = express();
const port = process.env.PORT || 7001;
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: "secret"
}));
initializePassport(passport, db);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(fileUpload());
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Real-Estate App",
      description: "This is a Real-Estate application REST API",
      contact: {
        name: "Yotam Ben-Gera",
      },
      servers: ["/", process.env.SERVER_URL]
    }
  },
  apis: ["server.js", "./routers/*.js"]
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});

app.get('/', (req, res) => {
  res.status(200).send('Welcome to the Real-Estate application!');
});


const users = require('./routers/users');
app.use('/users', users);
const products = require('./routers/products');
app.use('/products', products);
const cart = require('./routers/cart');
app.use('/cart', cart);
const applications = require('./routers/applications');
app.use('/applications', applications);
const auth = require('./routers/auth');
app.use('/auth', auth);


const { exec } = require('child_process');
app.use('/github', (req, res) => { //verify signature and secret
  const eventName = req.get('X-GitHub-Event');
  if (eventName == 'push') {
    var deploy = exec('sh /root/healthy-harvest/utils/deploy.sh', (error, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }
    });
  }
  console.log('Recived push!');
  res.send('Recived !');
});