import { Octokit } from 'https://cdn.skypack.dev/@octokit/rest';

// connects us on the backend to our github api - token expires in 30 or 90 days - just check github
const octokit = new Octokit({
    auth: Secret.API_Token,
    userAgent: "Jeff's Stats",
    baseUrl: 'https://api.github.com',
});

// set a new date object
const date = new Date()
// our repository class
const repositories = await octokit.request('GET /user/repos?page=1&per_page=100', { type: 'owner' });

const repoArray = [];
const repoClassCreator = (data) => {
    for (let i = 0; i < data.length; i++) {

        // we are still having date display issues - will add to github issues 6.15.22
        let d = data[i];
        let splitIso = d.created_at.split("T")[0];
        let month = splitIso.split("-")[1];
        let year = splitIso.split("-")[0];
        // console.log(month + " " + year)
        // console.log(d.id)
        // console.log(month, year)
        const repoList = new Repository(d.id, d.name, d.created_at, d.description, d.pushed_at, d.svn_url);
        // console.log(repoList)
        repoArray.push(repoList);
    }
};

repoClassCreator(repositories.data);



class Language {
    constructor(language, percentage, totalBytes) {
        this.language = language;
        this.percentage = percentage;
        this.totalBytes = totalBytes;
    }
}

// this displays a single repository card - I think this is something I would like displayed on click
repoArray[1].repositoryCard();


// grabs specific repository -- we are not really using this
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

const getRepoLanguage = async (repos) => {

    // this loops through our array - repos = reposArray - this is where everything is stored, we use it to grab the name of all repos I own
    for (let i = 0; i < repos.length; i++) {
        // console.log(repos[i].name)

        const languages = await octokit.request('GET /repos/{owner}/{repo}/languages', { owner: 'jpatterson933', repo: repos[i].name });
        // if we console.log languages.data it will show all of the data for the languages used
        // console.log(languages)
    }


}
// uncomment to run function above;
// getRepoLanguage(repoArray);

// list of buttons by class name on screen - think I am coding in circles. Time to sleep 
const onScreenRepoButtons = document.getElementsByClassName("repo-btn");



const languages = await octokit.request('GET /repos/{owner}/{repo}/languages', { owner: 'jpatterson933', repo: "resume" });
let langData = languages.data;

// console.log(langData, "lang data")

// here we get the total bytes of all languages added
let total = 0;
const getTotal = async (langData) => {
    for (const lang in langData) {
        // lang is the name of the language being used
        // console.log(lang, "get total lang")
        total += Number(langData[lang])
        // will console log total until the loop is finished 
        // console.log(total, "get total total")


    }
};
// we can change langdata to something shorter using same function variable
getTotal(langData);
const languageArray = [];
// this will loop through the languages
const getPercentage = () => {
    for (const lang in langData) {
        // this is our language name
        // console.log(lang);
        // console.log(langData[lang], "lang data");
        // this calculates the percantage by taking the value, turning it into a number, dividing by total from getTotal(); multiplying by 100 and gettting a percentage to the second decimal to the right and then adding a % symbol
        let percentage = (((Number(langData[lang])) / total) * 100).toFixed(2) + "%";
        // our percentage
        // console.log(percentage);

        const languageList = new Language(lang, percentage, langData[lang]);

        languageArray.push(languageList);
    }
};
// this is the function above
getPercentage();

// console.log(languageArray[0]);



// const createChart = () => {
//     // let backgroundColor = [];
//     let data = [];
//     let labels = [];

//     for (let i = 0; i < languageArray.length; i++) {
//         data.push(Number(languageArray[i].totalBytes))
//         labels.push(languageArray[i].language)
//     }

//     /// works - this is in the works by is essnetially a way to create a pie chart
//     const languagePieChart = new Chart("repo-lang-stats", {
//         type: "pie",
//         data: {
//             labels: labels,
//             datasets: [{
//                 backgroundColor: ["red", "blue", "green", "yellow"],
//                 data: data
//             }]
//         },
//         options: {
//             title: {
//                 display: true,
//                 text: "Resume"
//             }
//         }
//     });

// }

// createChart();
