import { Octokit } from 'https://cdn.skypack.dev/@octokit/rest';

// connects us on the backend to our github api - token expires in 30 or 90 days - just check github
const octokit = new Octokit({
    auth: Secret.API_Token,
    userAgent: "Jeff's Stats",
    baseUrl: 'https://api.github.com',
});

class RepoButton {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }


    // this is the 
    displayRepos() {
        const repoList = $("#repo-list");
        const button = `<div id="${this.id}" class="repo-btn" name="${this.name}">${this.name}</div>`
        repoList.append(button);

    }

};

const repoArray = [];

const repositories = await octokit.request('GET /user/repos?page=1&per_page=100', { type: 'owner' });
// shows all repo data
// console.log(repositories.data)
const repoBtnArray = [];

const repoButtonCreator = (data) => {
    for (let i = 0; i < data.length; i++) {
        let d = data[i];

        const repoList = new RepoButton(d.id, d.name);
        repoBtnArray.push(repoList);
    }
};

repoButtonCreator(repositories.data);

// here we create a nav bar with all repos that have been created for Jeffery william Patterson
const repoNavBar = () => {


    for (let i = 0; i < repoBtnArray.length; i++) {
        repoBtnArray[i].displayRepos();

    }
}

repoNavBar();


