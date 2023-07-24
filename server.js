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


class repositoryInformation {
  constructor(id, name, creation_date, languageData) {
    this.id = id;
    this.name = name;
    this.creation_date = creation_date;
    this.languageData = languageData;
    this.readableDate = this.createReadableDate();
    this.totalBytes = this.countTotalLanguageBytesInRepo();
    this.languagesPercentForRepo = this.getPercentOfLanguageUsedInRepo()
    
  }

  createReadableDate() {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(this.creation_date).toLocaleDateString(undefined, options);
    return formattedDate;
  }

  // get total bytes of language
  countTotalLanguageBytesInRepo() {
    let totalLanguageBytesInRepo = 0;
    for (const [languageName, bytes] of Object.entries(this.languageData)) {
      totalLanguageBytesInRepo += Number(bytes);
    };
    return totalLanguageBytesInRepo;
  };


  getPercentOfLanguageUsedInRepo() {
    const languageListForRepo = [];
    for (const [key, value] of Object.entries(this.languageData)) {
      let percentage = (((Number(value)) / this.totalBytes) * 100).toFixed(2) + "%";
      const languageClassObjectForRepo = { languageName: key, languagePercentage: percentage }
      languageListForRepo.push(languageClassObjectForRepo);
    }
    return languageListForRepo;
  };
}

// function to write to file that we will use --- TYPE into gitbash node server.js
function writeToFile(fileName, fileData) {
  fs.writeFile(path.join(__dirname, "/./js/json", fileName), JSON.stringify(fileData), (err) => {
    err ? console.log(err) : console.log("100% of the Data successfully saved in js/json Directory! \n");
  });
};

const getUserRepositoryInfo = async () => {
  try {
    const githubUserReposQuery = 'GET /user/repos?page=1&per_page=100';
    const userRepoData = await octokit.request(githubUserReposQuery, { type: 'owner' });
    // console.log(userRepoData)
    return userRepoData;
  } catch (error) {
    console.error(error);
  };
};
async function getUserRepositoryInformation() {
  try {
    const publicRepoData = await getUserRepositoryInfo();
    const repoInfoArray = [];

    for (let i = 0; i < publicRepoData.data.length; i++) {
      let { id, name, created_at } = publicRepoData.data[i];
      const githubRepoLanguageQuery = 'GET /repos/{owner}/{repo}/languages';
      const repoLanguage = await octokit.request(githubRepoLanguageQuery, { owner: 'jpatterson933', repo: name });

      const percentOfLoopCompleted = `${((i / publicRepoData.data.length) * 100).toFixed(2)} % Complete`;
      console.log(percentOfLoopCompleted);

      const newRepoObject = new repositoryInformation(id, name, created_at, repoLanguage.data);
      repoInfoArray.push(newRepoObject);

    }
    return repoInfoArray;
  } catch (error) {
    console.error(error);
  };
};


// MAIN FUNCTION --- This function is what is saving all information to be used in front end file
const repoGrab = async () => {

  // writeToFile("repoData.json", eachReposBasicInfo);
  const userRepoInfoArray = await getUserRepositoryInformation();
  console.log(userRepoInfoArray)
  writeToFile("repoData.json", userRepoInfoArray);
};
repoGrab();