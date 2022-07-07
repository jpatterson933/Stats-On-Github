import { Octokit } from 'https://cdn.skypack.dev/@octokit/rest';
const fs = require('fs');

// Page loader
const loader = document.getElementById("loader");
// html element for chart loader
const chartLoader = document.getElementById("chart-loader");
chartLoader.style.display = "none";

// this is our chart loading function
const chartLoading = (element, show) => {
    element.style.display = show;
    element.style.position = "fixed";
}

// page loading function
const pageLoading = (element) => {
    if ($(document).ready()) {
        element.style.display = "none";
    } else {
        element.style.display = "block";
        element.style.position = "absolute";
    }
}

// this is our page loading function
pageLoading(loader);

// connects us on the backend to our github api - token expires in 30 or 90 days - just check github
const octokit = new Octokit({
    auth: Secret.API_Token,
    userAgent: "Jeff's Stats",
    baseUrl: 'https://api.github.com',
});
// api request to grab Jeff's list of all repositories at 100 per page
const repositories = await octokit.request('GET /user/repos?page=1&per_page=100', { type: 'owner' });
const repoBtnArray = [];

console.log(repositories.data)

fs.writeFile("books.txt", repositories.data, (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully\n");
      console.log("The written has the following contents:");
      console.log(fs.readFileSync("books.txt", "utf8"));
    }
  });

// a function to create our RepoButton classes - data is the data we grab from const repositories
const repoButtonCreator = (data) => {
    for (let i = 0; i < data.length; i++) {
        let d = data[i];
        // as we loop through we create a new RepoButton class
        const repoList = new RepoButton(d.id, d.name);
        // push the new classes of RepoButtons into our empty area const repoBtnArray = []
        repoBtnArray.push(repoList);
    }
};
// here we run the above function
repoButtonCreator(repositories.data);

// here we create a side bar with all repos that have been created for Jeffery william Patterson
const repoNavBar = () => {
    for (let i = 0; i < repoBtnArray.length; i++) {
        // we loop through the empty arrays and run our displayRepos function that exists in our RepoButton class constructor
        repoBtnArray[i].displayRepos();
    }
}
// here we run the above function
repoNavBar();
// our function to create a new canvas as well as all associated html elements
const createCanvasElement = () => {
    const chartWrapper = $("#pie-chart");
    // we empty our html element and clear it before replacing with new one
    chartWrapper.empty();
    // create canvas pie chart
    const pieChart = document.createElement("canvas");
    // Create a class attribute:
    const id = document.createAttribute("id");
    // Set the value of the class attribute:
    id.value = "repo-lang-stats";

    pieChart.setAttributeNode(id);
    chartWrapper.append(pieChart);
}

// this on click allows us to grab the name and id and plug it in but we have not figured out how to make a chart out of the click

$("body").on("click", ".button-list", async function (e) {
    chartLoading(chartLoader, "block")
    createCanvasElement();
    // empty then create then append our canvas element
    const clickedButtonHolder = $("#clicked-button");
    clickedButtonHolder.empty();
    // ^^^ add button class in selector
    let $btn = $(this) /* button event occurs on */
    let id = $btn[0].id;
    let clickedBtnRepoName = $btn[0].name;
    // console.log(clickedBtnRepoName, "repository with id:", id)
    // clickedButtonHolder.append(clickedBtnRepoName);

    // here is our error cannot use await but without await we cannot load data past this point
    const languages = await octokit.request('GET /repos/{owner}/{repo}/languages', { owner: 'jpatterson933', repo: clickedBtnRepoName });
    let langData = languages.data;

    // console.log(langData, "lang")

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

    // empty languages array that we later append the list of all languages classes
    const languageArray = [];

    // this will loop through the languages
    const getPercentage = (langData) => {
        for (const lang in langData) {
            // this calculates the percantage by taking the value, turning it into a number, dividing by total from getTotal(); multiplying by 100 and gettting a percentage to the second decimal to the right and then adding a % symbol
            let percentage = (((Number(langData[lang])) / total) * 100).toFixed(2) + "%";
            // our percentage
            const languageList = new Language(lang, percentage, langData[lang]);
            // pushing into empty array
            languageArray.push(languageList);
        }
    };
    // this is the function above
    getPercentage(langData);
    // we create the chart
    createChart(languageArray, clickedBtnRepoName);
    chartLoading(chartLoader, "none")
});

// our create chart function 
const createChart = (list, btnName) => {
    const screenWidth = window.screen.width;
    // empty array to store data in the for loop
    let data = [];
    // empty array to store labels in the for loop below
    let labels = [];
    // createChart Variable: languageArray, clickedBtnRepoName
    for (let i = 0; i < list.length; i++) {
        data.push(Number(list[i].totalBytes))
        labels.push(list[i].language + " " + list[i].percentage)
    }
    // short hand for multi use colors
    const neonGreen = "rgba(57, 211, 83, 1)";
    const green = "rgba(38, 166, 65, 1)";
    const turtleGreen = "rgba(0, 109, 50, 1)";
    const darkGreen = "rgba(14, 68, 41, 1)";

    // global style short hand
    let globalStyle = Chart.defaults.global
    let titleSize = 0;
    // here we are setting chart font size and title size based off of screen width
    if (screenWidth >= 750) {
        globalStyle.defaultFontSize = 22;
        titleSize = 25;

    } else if (screenWidth <= 750) {
        globalStyle.defaultFontSize = 10;
        titleSize = 12;

    }
    // global styles for Chart
    // globalStyle.defaultFont = `'Eczar', serif`;
    globalStyle.defaultColor = 'white';
    /// works - this is in the works by is essnetially a way to create a pie chart
    const languagePieChart = new Chart("repo-lang-stats", {
        type: "doughnut",
        data: {
            labels: labels,

            datasets: [{
                backgroundColor: [neonGreen, green, turtleGreen, darkGreen],
                hoverBackgroundColor: [green, turtleGreen, darkGreen, neonGreen],
                borderWidth: 2,
                borderColor: [green, turtleGreen, darkGreen, neonGreen],
                hoverBorderWidth: 6,
                hoverBorderColor: [neonGreen, green, turtleGreen, darkGreen],

                data: data
            }]
        },
        options: {
            title: {
                display: true,
                text: btnName,
                fontColor: 'white',
                fontSize: titleSize

            },
            legend: {
                position: 'left',
                labels: {
                    fontColor: 'white'
                }
            }

        }
    });
};