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

const repoGrab = async () => {
    const repositories = await octokit.request('GET /user/repos?page=1&per_page=100', { type: 'owner' });
    console.log(repositories.data);

    

    fs.writeFile("repo.js", JSON.stringify(repositories.data), (err) => {
        if (err)
          console.log(err);
        else {
          console.log("File written successfully\n");
          console.log("The written has the following contents:");
          console.log(fs.readFileSync("books.txt", "utf8"));
        }
      });
}

repoGrab();


