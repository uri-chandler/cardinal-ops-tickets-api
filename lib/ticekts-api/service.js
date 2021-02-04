const ticketsRepository = require('./repository');

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const WEEK_IN_MS = DAY_IN_MS * 7;

function rangeToBucketBoundaries(start, end, resolution) {
    const boundaryStep = resolution === 'day' ? DAY_IN_MS : WEEK_IN_MS;
    const boundaries = [];

    let nextBoundary = start;
    while (nextBoundary < end) {
        boundaries.push(nextBoundary);
        nextBoundary += boundaryStep;
    }

    boundaries.push(end);
    return boundaries;
}

async function getTickets(start, end, resolution = 'day') {
    const boundaries = rangeToBucketBoundaries(start, end, resolution);
    return ticketsRepository.getBuckets(start, end, boundaries);
}


module.exports = {
    rangeToBucketBoundaries,
    getTickets
};