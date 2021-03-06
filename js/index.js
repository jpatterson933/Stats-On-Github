// import our json files
import repoData from "./json/repoData.json" assert { type: "json" };
import languageData from "./json/chartData.json" assert { type: "json" };

class Language {
    constructor(language, percentage, totalBytes) {
        this.language = language;
        this.percentage = percentage;
        this.totalBytes = totalBytes;
    }
};

function displayRepos(id, name) {
    const repoList = $("#repo-list");
    const button = `<button id="${id}" type="button" class="button-list" name="${name}">${name}</button>`
    repoList.append(button);
};

function repoNavBar() {
    for (let i = 0; i < repoData.length; i++) {
        // loop through our json data and create buttons
        displayRepos(repoData[i].id, repoData[i].name)
    }
};
// create our side bar
repoNavBar();

// our function to create a new canvas as well as all associated html elements
const createCanvasElement = () => {
    // grab html element
    const chartWrapper = $("#pie-chart");
    // we empty our html element and clear it before replacing with new one
    chartWrapper.empty();
    // create canvas pie chart
    const pieChart = document.createElement("canvas");
    // Create a id attribute
    const id = document.createAttribute("id");
    // Set the value of the class attribute:
    id.value = "repo-lang-stats";
    // set attribute to canvas element
    pieChart.setAttributeNode(id);
    chartWrapper.append(pieChart);
};

// this function grabs the stats associated with the repo button that was clicked but utilizing the name of that button clicked
function grabRepoLanguageStats(buttonClicked) {

    let repoName;
    // grab the language stats associate with the repo using a for loop that loops through the languageData.json file
    for (let i = 0; i < languageData.length; i++) {
        if (languageData[i].repoName === buttonClicked) {
            repoName = languageData[i];
            break;
        }
    };

    return repoName;
};

// get total bytes of language
function getTotal(langBytes) {
    let total = 0;
    // use Object entires to split object into key value pairs
    for (const [key, value] of Object.entries(langBytes)) {
        // use console.log() to see the key value pairs
        // console.log(`${key}: ${value}`);
        // as it loops through key value pairs, we add values to total
        total += Number(value);
    }

    return total;
};

function getLangPercent(langBytes, total) {
    const langList = [];

    for (const [key, value] of Object.entries(langBytes)) {
        let percentage = (((Number(value)) / total) * 100).toFixed(2) + "%";
        const languageList = new Language(key, percentage, value);
        // console.log(percentage);
        langList.push(languageList);
    }

    return langList;
};

$("body").on("click", ".button-list", function (e) {
    // function that creates our canvas element
    createCanvasElement();
    // targeted button that was clicked
    let $btn = $(this);
    let clickedBtnName = $btn[0].name;
    // takes the clicked button above as a parameter and finds the associated repository
    let repoStats = grabRepoLanguageStats(clickedBtnName);
    // assignt the repository grabbed above to repoLanguages to shorten variable name
    let repoLanguages = repoStats.languageData;
    // gets our byte total from repo stats
    let repoByteTotal = getTotal(repoLanguages);
    console.log(repoByteTotal)
    // function that assign an array of the percentages for the repo that was clicked on
    let repoPercentagePerLang = getLangPercent(repoLanguages, repoByteTotal);
    // here we created our chart using the rpo percentage per language and the name of the button that is clicked 
    createChart(repoPercentagePerLang, clickedBtnName);
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
        console.log(list, "list inside chart")
        // total bytes here is refering to the total bytes of that specific language
        data.push(Number(list[i].totalBytes))
        labels.push(list[i].language + " " + list[i].percentage)
    };
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

    };
    // global styles for Chart
    globalStyle.defaultColor = 'white';
    // this is where we create a new chart and assign it to the repo-lang-stats id
    const languagePieChart = new Chart("repo-lang-stats", {
        // type of graph
        type: "doughnut",
        data: {
            // graph labels
            labels: labels,

            datasets: [{
                // this is where we style our graph
                backgroundColor: [neonGreen, green, turtleGreen, darkGreen],
                hoverBackgroundColor: [green, turtleGreen, darkGreen, neonGreen],
                borderWidth: 2,
                borderColor: [green, turtleGreen, darkGreen, neonGreen],
                hoverBorderWidth: 6,
                hoverBorderColor: [neonGreen, green, turtleGreen, darkGreen],
                // data that is utilizied in graph
                data: data
            }]
        },
        // optinos where we show the titles, text is what shows in the title, font color and size
        options: {
            title: {
                display: true,
                text: btnName,
                fontColor: 'white',
                fontSize: titleSize
            },
            // the legend of the graph, where it should be and the color of the labels
            legend: {
                position: 'left',
                labels: {
                    fontColor: 'white'
                }
            }
        }
    });
};