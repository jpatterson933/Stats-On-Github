/* 
  Jeffery W. Patterson
  DFBW LLC
*/
// Backend files and Packages
const { Octokit, App } = require("octokit");
require('dotenv').config()
// console.log(process.env)
const fs = require('fs');
const path = require('path');

const octokit = new Octokit({
  auth: process.env.API_TOKEN,
  userAgent: "Jeff's Stats",
  baseUrl: 'https://api.github.com',
});

class RepoData {
  constructor(id, name, created) {
    this.id = id;
    this.name = name;
    this.created = created;
  };
};

class LanguagePieChartData {
  constructor(repoName, languageData) {
    this.repoName = repoName;
    this.languageData = languageData;
  };
};

// function to write to file that we will use --- TYPE into gitbash node server.js
function writeToFile(fileName, fileData) {
  fs.writeFile(path.join(__dirname, "/./js/json", fileName), JSON.stringify(fileData), (err) => {
    err ? console.log(err) : console.log("100% of the Data successfully saved in js/json Directory! \n");
  });
};

const getRepositoryInfo = async () => {
  try {
    const repositoryData = await octokit.request('GET /user/repos?page=1&per_page=100', { type: 'owner' });
    return repositoryData;
  } catch (error) {
    console.error(error);
  };
};

const createRepoInfoClassArray = (data) => {
  try {
    const repositoryClassArray = [];
    for (let i = 0; i < data.length; i++) {
      let eachReposData = data[i];
      const repoInstance = new RepoData(eachReposData.id, eachReposData.name, eachReposData.created_at);
      repositoryClassArray.push(repoInstance);
    }
    return repositoryClassArray;
  } catch (error) {
    console.error(error);
  };
};

const grabUsedLanguagesForRepository = async (repositoryInfo) => {
  try {

    const repoLanguageDataInstanceArray = [];
    for (let i = 0; i < repositoryInfo.length; i++){
      
      const languages = await octokit.request('GET /repos/{owner}/{repo}/languages', { owner: 'jpatterson933', repo: repositoryInfo[i].name });
      
      const percentageOfCompletedLoop = ((i / repositoryInfo.length) * 100).toFixed(2) + "% Complete";
      // print to console
      console.log(percentageOfCompletedLoop);

      const repoLanguageDataInstance = new LanguagePieChartData(repositoryInfo[i].name, languages.data);
      
      repoLanguageDataInstanceArray.push(repoLanguageDataInstance);
    }

    return repoLanguageDataInstanceArray;
    
  } catch (error){
    console.error(error);
  }
}

// MAIN FUNCTION --- This function is what is saving all information to be used in front end file
const repoGrab = async () => {
  // const repositories = await octokit.request('GET /user/repos?page=1&per_page=100', { type: 'owner' });
  // getRepositoryInfo();
  const repositoryData = await getRepositoryInfo();
  // Function that grabs repo data and stores it into RepoData Classes
  const repoClassInstanceArray = createRepoInfoClassArray(repositoryData.data)
  const repoLanguageDataInstanceArray = await grabUsedLanguagesForRepository(repoClassInstanceArray);
 
  // writing data to file
  writeToFile("repoData.json", repoClassInstanceArray);
  writeToFile("chartData.json", repoLanguageDataInstanceArray);
  
};
repoGrab();