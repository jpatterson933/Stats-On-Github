// const express = require('express');
// const path = require('path');
// const app = express();
// const PORT = 3000;
// const key = require('./config/utils');
// app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
// app.listen(PORT, () => console.log(`Now listening on Port ${PORT}`))

const { Octokit, App } = require("octokit");
require('dotenv').config()
// console.log(process.env)
const fs = require('fs');

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



const repoGrab = async () => {
    const repositories = await octokit.request('GET /user/repos?page=1&per_page=100', { type: 'owner' });
    console.log(repositories.data);


    const repoBtnArray = [];

    
    // a function to create our RepoButton classes - data is the data we grab from const repositories
    const repoButtonCreator = (data) => {
        for (let i = 0; i < data.length; i++) {
            let d = data[i];
            // as we loop through we create a new RepoButton class
            const repoList = new RepoData(d.id, d.name, d.created_at);
            // push the new classes of RepoButtons into our empty area const repoBtnArray = []
            repoBtnArray.push(repoList);
        }
    };
    // here we run the above function
    repoButtonCreator(repositories.data);

    console.log(repoBtnArray)







    

    fs.writeFile("repoData.js", JSON.stringify(repoBtnArray), (err) => {
        if (err)
          console.log(err);
        else {
          console.log("File written successfully\n");
          console.log("The written has the following contents:");
          console.log(fs.readFileSync("repoData.js", "utf8"));
        }
      });
}

repoGrab();


