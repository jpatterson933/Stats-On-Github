// testing data saved by fs in server file

// import data from './data.json';

// import data from './chartData.json'

const data = require('./chartData.json')

test('JSON data has required properties and types', () => {
    data.forEach(repository => {
        // ensure we have basic term setup
        expect(repository).toHaveProperty('repoName')
        expect(repository.repoName).toEqual(expect.any(String));

    })
})