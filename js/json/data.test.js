const chartData = require('./chartData.json');
const repoData = require('./repoData.json');

describe("JSON data has required properties and types", () => {
    test('repoData has keys and values', () => {
        repoData.forEach(repository => {
            expect(repository).toHaveProperty('id');
            expect(repository).toHaveProperty('name');
            expect(repository).toHaveProperty('creation_date');
            expect(repository).toHaveProperty('languageData');
            expect(repository).toHaveProperty('readableDate');
            expect(repository).toHaveProperty('totalBytes');
            expect(repository).toHaveProperty('languagesPercentForRepo');

            expect(repository.id).toEqual(expect.any(Number));
            expect(repository.name).toEqual(expect.any(String));
            expect(repository.creation_date).toEqual(expect.any(String));
            expect(repository.languageData).toEqual(expect.any(Object));
            expect(repository.readableDate).toEqual(expect.any(String));
            expect(repository.totalBytes).toEqual(expect.any(Number));
            expect(repository.languagesPercentForRepo).toEqual(expect.any(Array));
            repository.languagesPercentForRepo.forEach(language => {
                expect(language).toHaveProperty("languageName")
                expect(language).toHaveProperty("languagePercentage")

                expect(language.languageName).toEqual(expect.any(String))
                expect(language.languagePercentage).toEqual(expect.any(String))
            })
            
            
        }) 
    })
    // test('chartData has repoName and languageData properties and types', () => {
    //     chartData.forEach(repository => {
    //         // check for properties
    //         expect(repository).toHaveProperty('repoName');
    //         expect(repository).toHaveProperty('languageData');
    //         // check the types of the properties
    //         expect(repository.repoName).toEqual(expect.any(String));
    //         expect(repository.languageData).toEqual(expect.any(Object));
    //     });
    // });

    // test("repoData has required propreties and keys", () => {
    //     repoData.forEach(repository => {
    //         // check for properties
    //         expect(repository).toHaveProperty('id');
    //         expect(repository).toHaveProperty('name');
    //         expect(repository).toHaveProperty('created');
    //         // check the types of the properties
    //         expect(repository.id).toEqual(expect.any(Number));
    //         expect(repository.name).toEqual(expect.any(String));
    //         expect(repository.created).toEqual(expect.any(String));
    //         // ensure date is same format with T separating data and time
    //         expect(repository.created).toContain('T');
    //     });
    // });

    // test('matching repoName in chartData with repoData', () => {
    //     chartData.forEach(({ repoName }) => {
    //         // ensure each data file has matching repo else entire program breaks
    //         const matchingRepo = repoData.find(matchingName => matchingName.name === repoName);
    //         expect(matchingRepo).toBeDefined();
    //     });
    // });
});