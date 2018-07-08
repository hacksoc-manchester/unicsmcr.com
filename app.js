const express = require('express');
const morgan = require('morgan');

const port = process.env.PORT || 5000;
const app = express();

app.use(morgan(process.env.ENVIRONMENT));
app.listen(port);
console.log("App started on port: " + port);
