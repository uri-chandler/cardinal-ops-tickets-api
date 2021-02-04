const SUPPORTED_RESOLUTIONS = ['week', 'day'];

function clientError(eMsg, res) {
    res.status(400).json({
        ok: false,
        error: eMsg
    });
}

module.exports = (req, res, next) => {
    const { start_timestamp, end_timestamp, bucket_size } = req.query;

    if (SUPPORTED_RESOLUTIONS.includes(bucket_size) === false)
        return clientError(`Unsupported bucket_size "${bucket_size}" (try "week" or "day" instead)`, res);
        
    if ( isNaN(parseInt(start_timestamp)) === true)
        return clientError(`Invalid start_timestampe "${start_timestamp}" (must be in milliseconds)`, res);
    
    if ( isNaN(parseInt(end_timestamp)) === true)
        return clientError(`Invalid end_timestamp "${end_timestamp}" (must be in milliseconds)`, res);
    
    if (parseInt(end_timestamp) <= parseInt(start_timestamp))
        return clientError(`Invalid range (start_timestamp must be smaller than end_timestamp)`, res);

    next();
};