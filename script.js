import { Octokit } from 'https://cdn.skypack.dev/@octokit/rest';

// connects us on the backend
const octokit = new Octokit({
    auth: Secret.API_Token,
    userAgent: "Jeff's Stats",
    baseUrl: 'https://api.github.com',
});

const date = new Date()

class Repository {
    constructor(id, name, createdAt, description, lastCommit, url) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
        this.description = description;
        this.lastCommit = new Date(lastCommit);
        this.url = url;
    }

    logInfo() {
        // console.log("testing")
    }

    showRepoNames() {
        // const list = $("#repo-list");
        list.append(this.name);
    }

    repositoryCard() {
        const repoCardWrapper = $("#repo-cards");
        const card = `<div id="card">
                <h1>${this.name}</h1>
                <p>${this.createdAt}</p>
                <p>${this.description}</p>
                <p>${this.lastCommit}</p>
                <p><a href="${this.url}" target="_blank">Check me out!</a></p>
            </div>
            `

        repoCardWrapper.append(card);
    }
};


const repositories = await octokit.request('GET /user/repos?page=1&per_page=1000', { type: 'owner' });
// shows all repo data
// console.log(repositories.data)
const repoArray = [];

const repoConstructor = (data) => {

    for (let i = 0; i < data.length; i++) {


        let d = data[i];
        let splitIso = d.created_at.split("T")[0];
        let month = splitIso.split("-")[1];
        let year = splitIso.split("-")[0];
        // console.log(month + " " + year)
        // console.log(d.id)
        const repoList = new Repository(d.id, d.name, d.created_at, d.description, d.pushed_at, d.svn_url);
        // console.log(repoList)
        repoArray.push(repoList);
    }
};

repoConstructor(repositories.data);

repoArray[1].repositoryCard();

// grabs specific repository
octokit
    .paginate("GET /repos/{owner}/{repo}", {
        owner: "jpatterson933",
        repo: "resume",
    })
    .then((res) => {

        // console.log(res)
    });
/*--------------------------------------------------------------- */

// returns languages of specific repository in bytes - 1 byte is enough to hold about 1 typed character, e.g. 'b' or 'X' or '$'
const languages = await octokit.request('GET /repos/{owner}/{repo}/languages', { owner: 'jpatterson933', repo: "resume" });
console.log(languages.data, "lang here")
let langData = languages.data;

// here we get the total bytes of all languages added
let total = 0;
const getTotal = () => {
    for (const lang in langData) {
        total += Number(langData[lang])
        console.log(total)
    }
};

getTotal();

const getPercentage = () => {
    

    for (const lang in langData) {
        let percentage = (Number(langData[lang])) / total;

        console.log(percentage, "percentage?")

    }
    
}

getPercentage();


/// works
const languagePieChart = new Chart("repo-lang-stats", {
    type: "pie",
    data: {
        labels: ["x", "y", "z"],
        datasets: [{
            backgroundColor: ["green", "blue", "red"],
            data: [25, 25, 50]
        }]
    },
    options: {
        title: {
            display: true,
            text: "Testing Pie Graph"
        }
    }
});


