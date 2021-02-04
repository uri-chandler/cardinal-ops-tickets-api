const ticketsService = require('./service');

describe('Tickets Service', () => {

    it('.rangeToBucketBoundaries() converts a range to "day" boundaries', () => {
        const start = 1577836800000; // Januaray 1st, 2020 @ 00:00
        const end = 1578355200000;   // Januaray 7th, 2020 @ 00:00

        const boundaries = ticketsService.rangeToBucketBoundaries(start, end, 'day');
        expect(boundaries).toMatchObject([
            1577836800000,  // Januaray 1st, 2020 @ 00:00
            1577923200000,  // Januaray 2nd, 2020 @ 00:00
            1578009600000,  // Januaray 3th, 2020 @ 00:00
            1578096000000,  // Januaray 4th, 2020 @ 00:00
            1578182400000,  // Januaray 5th, 2020 @ 00:00
            1578268800000,  // Januaray 6th, 2020 @ 00:00
            1578355200000   // Januaray 7th, 2020 @ 00:00
        ]);
    });

    it('.rangeToBucketBoundaries() converts a range to "week" boundaries', () => {
        const start = 1577836800000; // Januaray 1st, 2020 @ 00:00
        const end = 1580428800000;   // Januaray 31st, 2020 @ 00:00

        const boundaries = ticketsService.rangeToBucketBoundaries(start, end, 'week');
        expect(boundaries).toMatchObject([
            1577836800000,  // Januaray 1st, 2020 @ 00:00
            1578441600000,  // Januaray 8th, 2020 @ 00:00
            1579046400000,  // Januaray 15th, 2020 @ 00:00
            1579651200000,  // Januaray 22th, 2020 @ 00:00
            1580256000000,  // Januaray 29th, 2020 @ 00:00
            1580428800000,  // Januaray 31st, 2020 @ 00:00
        ]);
    });
});