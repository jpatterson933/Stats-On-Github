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
  }
};

class LanguagePieChartData {
  constructor(repoName, languageData) {
    this.repoName = repoName;
    this.languageData = languageData;
  }
};

// function to write to file that we will use --- TYPE into gitbash node server.js
function writeToFile(fileName, fileData) {
  fs.writeFile(path.join(__dirname, "/./js/json", fileName), JSON.stringify(fileData), (err) => {
    err ? console.log(err) : console.log("100% of the Data successfully saved in js/json Directory! \n")
  });
}

const getRepositoryInfo = async () => {
  try {
    const repositoryData = await octokit.request('GET /user/repos?page=1&per_page=100', { type: 'owner' });
    return repositoryData;
  } catch (error) {
    console.error(error);
  };
};

const createRepoClassInstance = (data) => {
  try {
    const repoClassInstanceArray = [];
    for (let i = 0; i < data.length; i++) {
      let eachReposData = data[i];
      const repoInstance = new RepoData(eachReposData.id, eachReposData.name, eachReposData.created_at);
      repoClassInstanceArray.push(repoInstance);
    }
    return repoClassInstanceArray;
  } catch (error) {
    console.error(error);
  }
}

// MAIN FUNCTION --- This function is what is saving all information to be used in front end file
const repoGrab = async () => {
  // const repositories = await octokit.request('GET /user/repos?page=1&per_page=100', { type: 'owner' });
  // getRepositoryInfo();
  const repositoryData = await getRepositoryInfo();
  // Empty array for storing repo Classes
  // const repoClassArray = [];



  // Function that grabs repo data dn stores it into RepoData Classes
  // repoClassCreator(repositoryData.data);
  const repoClassInstanceArray = createRepoClassInstance(repositoryData.data)
  // empty array to store the lanuage data to be used in the graph
  const languageGraphDataArray = [];
  // async function grabbing all language information on each repository
  const gatherLanguageData = async (data) => {
    // loops through repos and grabs language data for each specific repo and stores that in a LanguagePieChartData class instance
    for (let i = 0; i < data.length; i++) {
      // store our data[i] in d so we don't have to type it out a bunch of times
      let d = data[i];
      const languages = await octokit.request('GET /repos/{owner}/{repo}/languages', { owner: 'jpatterson933', repo: d.name });
      // languages.data grabbed in the await octokit request stored in shorter variable name
      let langData = languages.data;
      // percentage of repos that have been loop through
      let percentageTest = ((i / data.length) * 100).toFixed(2) + "% Complete";
      // print percentage to console letting user know how many repos have been gone through
      console.log(percentageTest);
      // create new class instances here
      const langDataChart = new LanguagePieChartData(d.name, langData);
      // push into empty array
      languageGraphDataArray.push(langDataChart);
    }

    // path.join(__dirname,"niktoResults","result.txt")
    writeToFile("chartData.json", languageGraphDataArray);
  };
  // gathering data
  gatherLanguageData(repoClassInstanceArray);
  // writing data to file
  writeToFile("repoData.json", repoClassInstanceArray);
};
repoGrab();