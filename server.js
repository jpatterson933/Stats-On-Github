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
    const githubUserReposQuery = 'GET /user/repos?page=1&per_page=100';
    const userRepoData = await octokit.request(githubUserReposQuery, { type: 'owner' });
    return userRepoData;
  } catch (error) {
    console.error(error);
  };
};

const createRepoInfoClassArray = (data) => {
  try {
    const basicRepoInfo = [];
    for (let i = 0; i < data.length; i++) {
      let {id, name, created_at} = data[i];
      const repoInstance = new RepoData(id, name, created_at);
      basicRepoInfo.push(repoInstance);
    }
    return basicRepoInfo;
  } catch (error) {
    console.error(error);
  };
};

const grabRepoLanguageInfo = async (repositoryInfo) => {
  try {

    const eachReposLanguageInfo = [];
    for (let i = 0; i < repositoryInfo.length; i++){
      const githubLanguageQuery = 'GET /repos/{owner}/{repo}/languages';
      const languages = await octokit.request(githubLanguageQuery, { owner: 'jpatterson933', repo: repositoryInfo[i].name });
      
      const percentOfLoopCompleted = ((i / repositoryInfo.length) * 100).toFixed(2) + "% Complete";
      // print to console
      console.log(percentOfLoopCompleted);

      const languagesOfRepo = new LanguagePieChartData(repositoryInfo[i].name, languages.data);
      
      eachReposLanguageInfo.push(languagesOfRepo);
    }

    return eachReposLanguageInfo;
    
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
  const eachReposBasicInfo = createRepoInfoClassArray(repositoryData.data)
  const eachReposLanguageInfo = await grabRepoLanguageInfo(eachReposBasicInfo);
 
  // writing data to file
  writeToFile("repoData.json", eachReposBasicInfo);
  writeToFile("chartData.json", eachReposLanguageInfo);
  
};
repoGrab();