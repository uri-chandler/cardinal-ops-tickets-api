require('dotenv').config();

const express = require('express');
const morgan = require('morgan');

const config = require('./lib/config');
const { ticketsController } = require('./lib/ticekts-api');
const { ticketsRepository } = require('./lib/ticekts-api');

async function start() {
    
    await ticketsRepository.connect();
    
    const app = express();

    app.use(morgan('dev'));
    app.use('/api', ticketsController);
    
    app.listen(config.PORT, () => {
        console.log(`App started @ http://localhost:${config.PORT}`);
    });
}


start().catch(console.error);
