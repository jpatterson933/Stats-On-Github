// testing data saved by fs in server file

// import data from './data.json';

// import data from './chartData.json'

const data = require('./chartData.json')

describe("JSON data has required properties and types", () => {
    test('JSON data has repoName and languageData properties and types', () => {
        data.forEach(repository => {
            // ensure we have basic term setup
            expect(repository).toHaveProperty('repoName')
            expect(repository.repoName).toEqual(expect.any(String));
            expect(repository).toHaveProperty('languageData');
            expect(repository.languageData).toEqual(expect.any(Object));
        });
    });

})
