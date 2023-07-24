// import our json files
import repoData from "./json/repoData.json" assert { type: "json" };
import languageData from "./json/chartData.json" assert { type: "json" };
import repositoryData from "./json/repoData.json" assert { type: "json" };

console.log(repositoryData);
// 1. Language Class is constructed
class Language { // DEPRECATED
    constructor(language, percentage, totalBytes) {
        this.language = language;
        this.percentage = percentage;
        this.totalBytes = totalBytes;
    };
};
// get total bytes of language - DEPRECATED
function countTotalBytesInRepo(languagesByteObjectArray) {
    let totalBytesInRepo = 0;
    for (const [languageName, bytes] of Object.entries(languagesByteObjectArray)) {
        totalBytesInRepo += Number(bytes);
    };
    return totalBytesInRepo;
};


function displayRepos(id, name) {
    const repoList = $("#repo-list");
    const button = `<button id="${id}" type="button" class="button-list" name="${name}">${name}</button>`;
    repoList.append(button);
};
function repoNavBar() {
    for (let i = 0; i < repoData.length; i++) {
        // loop through our json data and create buttons
        displayRepos(repoData[i].id, repoData[i].name);
    };
};
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



function loadPieGraphOnClick() {
    $("body").on("click", ".button-list", function (e) {
        // function that creates our canvas element
        createCanvasElement();
        // targeted button that was clicked
        let $btn = $(this);
        let buttonNameValue = $btn[0].name;
        grabDataForChart(buttonNameValue)
        // return buttonNameValue;
    });
};

loadPieGraphOnClick();

// this function grabs the stats associated with the repo button that was clicked but utilizing the name of that button clicked
function returnMatchingJsonObject(buttonNameValue) {
// REPOSITORY DATA
    let matchingRepoObject;
    // grab the language stats associate with the repo using a for loop that loops through the languageData.json file
    for (let i = 0; i < repositoryData.length; i++) {
        if (repositoryData[i].name === buttonNameValue) {
            matchingRepoObject = repositoryData[i];
            break;
        };
    };
    console.log(matchingRepoObject)
    return matchingRepoObject;
};


/**-------------------------------------------------graph options --------------------------------------- */
function setChartFontSize() {
    // here we are setting chart font size and title size based off of screen width
    if (window.screen.width >= 750) {
        return 22;

    } else if (window.screen.width <= 750) {
        return 10;
    };
};
function setTitleSize() {
    let titleSize = 0;
    if (window.screen.width >= 750) {
        return titleSize = 40;
    } else if (window.screen.width <= 750) {
        return titleSize = 12;
    };
};
function datasetStylingOptionsAnd(data) {
    console.log(data, "inside datasetStylingOptionsAnd(data)")
    const neonGreen = "rgba(57, 211, 83, 1)";
    const green = "rgba(38, 166, 65, 1)";
    const turtleGreen = "rgba(0, 109, 50, 1)";
    const darkGreen = "rgba(14, 68, 41, 1)";

    return [{
        // this is where we style our graph
        backgroundColor: [neonGreen, green, turtleGreen, darkGreen],
        hoverBackgroundColor: [green, turtleGreen, darkGreen, neonGreen],
        borderWidth: 2,
        borderColor: [green, turtleGreen, darkGreen, neonGreen],
        hoverBorderWidth: 6,
        hoverBorderColor: [neonGreen, green, turtleGreen, darkGreen],
        // data that is utilizied in graph
        data: data
    }];
};

const datasetTitleOptions = (repoName, titleSize) => {
    // button name in this case is the name of the repo
    return {
        display: true,
        text: repoName,
        fontColor: 'white',
        fontSize: titleSize
    };
};

const datasetLegendOptions = () => {
    return {
        position: 'left',
        labels: {
            fontColor: 'white'
        }
    };
};

const datasetDataOptions = (data, labels) => {
    return {
        // graph labels
        labels: labels,
        datasets: datasetStylingOptionsAnd(data)
    };
};

const graphKeyOptions = (repoName, titleSize) => {
    return {
        title: datasetTitleOptions(repoName, titleSize),
        legend: datasetLegendOptions(),
    };
};
const createDonutChart = (repoName, data, labels, titleSize) => {
    const donutChart = new Chart("repo-lang-stats", {
        type: "doughnut",
        data: datasetDataOptions(data, labels),
        options: graphKeyOptions(repoName, titleSize),
    });

    return donutChart;
}

// function 
const returnArray = (arrayType, newArray, list) => { // DEPRECATED
    try {
        for (let i = 0; i < list.length; i++) {
            if (arrayType === "data") {
                newArray.push(Number(list[i].totalBytes));
            } else {
                newArray.push(`${list[i].language} ${list[i].percentage}`);
            }
        }
        return newArray;
    } catch (error) {
        console.error(error);
    };
};

// Issue #24
function getLanuagesArrayForRepo(languageObject) { // DEPRECATED
    let total = countTotalBytesInRepo(languageObject);
    const languageListForRepo = [];
    for (const [key, value] of Object.entries(languageObject)) {
        let percentage = (((Number(value)) / total) * 100).toFixed(2) + "%";
        const languageClassObjectForRepo = new Language(key, percentage, value);
        languageListForRepo.push(languageClassObjectForRepo);
    }
    return languageListForRepo;
};

function grabDataForChart(buttonValue) {
    // assignt the repository grabbed above to repoLanguages to shorten variable name
    let matchingRepoObject = returnMatchingJsonObject(buttonValue)
    // function that assign an array of the percentages for the repo that was clicked on
    let repoPercentagePerLang = getLanuagesArrayForRepo(matchingRepoObject.languageData);
    
    // here we created our chart using the rpo percentage per language and the name of the button that is clicked 
    loadChart(repoPercentagePerLang, buttonValue);
};

// our create chart function 
const loadChart = (list, repoName) => {
    console.log(list)
    let data = returnArray("data", [], list);
    let labels = returnArray("labels", [], list);

    // global style short hand
    let globalStyle = Chart.defaults.global;
    globalStyle.defaultFontSize = setChartFontSize();
    let titleSize = setTitleSize();
    // global styles for Chart
    globalStyle.defaultColor = 'white';

    createDonutChart(repoName, data, labels, titleSize);
};