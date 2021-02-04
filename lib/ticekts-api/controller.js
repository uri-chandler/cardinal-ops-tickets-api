const express = require('express');
const ticketService = require('./service');
const inputValidation = require('./controller.validation');

const controller = express.Router();

controller.get('/', inputValidation, async (req, res) => {
    try {
        const result = await ticketService.getTickets(
            parseInt(req.query.start_timestamp),
            parseInt(req.query.end_timestamp),
            req.query.bucket_size
        );
        
        res.status(200).json({
            ok: true,
            result
        });
    }
    catch (error) {
        // Client errors are caught by the "inputValidation" middleware above
        // If we reached this point, the error is internal to the server
        res.status(500).json({
            ok: false,
            error: error.message || 'Unexpected error'
        });
    }
});

module.exports = controller;