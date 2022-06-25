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
        const button = `<button id="${this.id}" type="button" class="button-list" name="${this.name}">${this.name}</button>`
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



// this on click allows us to grab the name and id and plug it in but we have not figured out how to make a chart out of the click

$("body").on("click", ".button-list", async function (e) {
    const clickedButtonHolder = $("#clicked-button");
    clickedButtonHolder.empty();
    // ^^^ add button class in selector
    let $btn = $(this) /* button event occurs on */
    let id = $btn[0].id;
    let clickedBtnRepoName = $btn[0].name;
    console.log(clickedBtnRepoName, "repository with id:", id)
    // clickedButtonHolder.append(clickedBtnRepoName);

    // here is our error cannot use await but without await we cannot load data past this point
    const languages = await octokit.request('GET /repos/{owner}/{repo}/languages', { owner: 'jpatterson933', repo: clickedBtnRepoName });
    let langData = languages.data;

    console.log(langData)


    // here we get the total bytes of all languages added
    let total = 0;
    const getTotal = async (langData) => {
        for (const lang in langData) {
            // lang is the name of the language being used
            console.log(lang, "get total lang")
            total += Number(langData[lang])
            // will console log total until the loop is finished 
            console.log(total, "get total total")
        }
    };

    // we can change langdata to something shorter using same function variable
    getTotal(langData);

    // empty languages array that we later append the list of all languages classes
    const languageArray = [];

    // this will loop through the languages
    const getPercentage = (langData) => {
        for (const lang in langData) {
            // this is our language name
            // console.log(lang);
            // console.log(langData[lang], "lang data");
            // this calculates the percantage by taking the value, turning it into a number, dividing by total from getTotal(); multiplying by 100 and gettting a percentage to the second decimal to the right and then adding a % symbol
            let percentage = (((Number(langData[lang])) / total) * 100).toFixed(2) + "%";
            // our percentage
            // console.log(percentage);

            const languageList = new Language(lang, percentage, langData[lang]);
            // pushing into empty array
            languageArray.push(languageList);
        }
    };
    // this is the function above
    getPercentage(langData);


    const createChart = () => {
        let data = [];
        let labels = [];

        for (let i = 0; i < languageArray.length; i++) {
            data.push(Number(languageArray[i].totalBytes))
            labels.push(languageArray[i].language)
        }
        
        /// works - this is in the works by is essnetially a way to create a pie chart
        const languagePieChart = new Chart("repo-lang-stats", {
            type: "pie",
            data: {
                labels: labels,
                datasets: [{
                    backgroundColor: ["red", "blue", "green", "yellow"],
                    data: data
                }]
            },
            options: {
                title: {
                    display: true,
                    text: clickedBtnRepoName
                }
            }
        });

    }
    createChart();
});
