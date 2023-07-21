// testing data saved by fs in server file

// import data from './data.json';

// import data from './chartData.json'

const chartData = require('./chartData.json');
const repoData = require('./repoData.json');

describe("JSON data has required properties and types", () => {
    test('chartData has repoName and languageData properties and types', () => {
        chartData.forEach(repository => {
            // check for properties
            expect(repository).toHaveProperty('repoName');
            expect(repository).toHaveProperty('languageData');
            // check the types of the properties
            expect(repository.repoName).toEqual(expect.any(String));
            expect(repository.languageData).toEqual(expect.any(Object));
        });

    });

    test("repoData has required propreties and keys", () => {
        repoData.forEach(repository => {
            // check for properties
            expect(repository).toHaveProperty('id');
            expect(repository).toHaveProperty('name');
            expect(repository).toHaveProperty('created');
            // check the types of the properties
            expect(repository.id).toEqual(expect.any(Number));
            expect(repository.name).toEqual(expect.any(String));
            expect(repository.created).toEqual(expect.any(String));
            // ensure date is same format with T separating data and time
            expect(repository.created).toContain('T');

        })
    })


})
