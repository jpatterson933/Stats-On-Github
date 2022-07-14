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

// html element for chart loader
const chartLoader = document.getElementById("chart-loader");
chartLoader.style.display = "none";

// repo data consists of ids, names and creation date
// console.log(repoData);
// console.log(languageData);

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

    //   console.log(total)
    // return total
    return total;
};

function getLangPercent (langBytes, total) {
    const langList = [];
    for (const [key, value] of Object.entries(langBytes)) {
        let percentage = (((Number(value)) / total) * 100).toFixed(2) + "%";

        const languageList = new Language(key, percentage, value);
        
        // console.log(percentage);
        langList.push(languageList);
    }

    // console.log(langPercent)

    return langList;


}

$("body").on("click", ".button-list", function (e) {

    createCanvasElement();
    // create a clicked button THIS HAS BEEN COMMENTED OUT
    // const clickedButton = $("#clicked-button");
    // empty our clicked button
    // clickedButton.empty();
    // this is our clicked button $(this) and assignet to $btn
    let $btn = $(this);
    let clickedBtnName = $btn[0].name;
    // takes the clicked button above as a parameter and finds the associated repository
    let repoStats = grabRepoLanguageStats(clickedBtnName);
    // assignt the repository grabbed above to repoLanguages to shorten variable name
    let repoLanguages = repoStats.languageData;







    // console.log(repoStats.languageData)
    // console.log(clickedBtnName)
    // gets our byte total from repo stats
    let repoByteTotal = getTotal(repoLanguages);
    console.log(repoByteTotal)
    // function that assign an array of the percentages for the repo that was clicked on
    let repoPercentagePerLang = getLangPercent(repoLanguages, repoByteTotal);

    console.log(repoPercentagePerLang);



    createChart(repoPercentagePerLang, clickedBtnName);
    




})

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

