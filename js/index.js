// import our json files
import repoData from "./json/repoData.json" assert { type: "json" };
import languageData from "./json/chartData.json" assert { type: "json" };
// 1. Language Class is constructed
class Language {
    constructor(language, percentage, totalBytes) {
        this.language = language;
        this.percentage = percentage;
        this.totalBytes = totalBytes;
    };
};
// get total bytes of language
function countTotalBytesInRepo(languagesByteObjectArray) {
    let totalBytesInRepo = 0;
    for (const [languageName, bytes] of Object.entries(languagesByteObjectArray)) {
        totalBytesInRepo += Number(bytes);
    };
    return totalBytesInRepo;
};

// Issue #24
function getLanuagesArrayForRepo(languageObject) {
    let total = countTotalBytesInRepo(languageObject);
    const languageListForRepo = [];
    for (const [key, value] of Object.entries(languageObject)) {
        let percentage = (((Number(value)) / total) * 100).toFixed(2) + "%";
        const languageClassObjectForRepo = new Language(key, percentage, value);
        languageListForRepo.push(languageClassObjectForRepo);
    }
    return languageListForRepo;
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

function grabDataForChart(buttonValue) {
    // assignt the repository grabbed above to repoLanguages to shorten variable name
    let matchingRepoObject = returnMatchingJsonObject(buttonValue).languageData;
    // function that assign an array of the percentages for the repo that was clicked on
    let repoPercentagePerLang = getLanuagesArrayForRepo(matchingRepoObject);
    // here we created our chart using the rpo percentage per language and the name of the button that is clicked 
    loadChart(repoPercentagePerLang, buttonValue);
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

    let repoMatchJsonObject;
    // grab the language stats associate with the repo using a for loop that loops through the languageData.json file
    for (let i = 0; i < languageData.length; i++) {
        if (languageData[i].repoName === buttonNameValue) {
            repoMatchJsonObject = languageData[i];
            break;
        };
    };
    return repoMatchJsonObject;
};

// function 
const returnArray = (arrayType, newArray, list) => {
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

/**-------------------------------------------------graph options --------------------------------------- */
function setChartTextSizeFromScreenWidth(globalStyle, screenWidth, titleSize) {
    // here we are setting chart font size and title size based off of screen width
    if (screenWidth >= 750) {
        globalStyle.defaultFontSize = 22;
        titleSize = 25;

    } else if (screenWidth <= 750) {
        globalStyle.defaultFontSize = 10;
        titleSize = 12;

    };
};
function datasetStylingOptionsAnd(data) {
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

const datasetTitleOptions = (btnName, titleSize) => {
    return {
        display: true,
        text: btnName,
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

const graphKeyOptions = (btnName, titleSize) => {
    return {
        title: datasetTitleOptions(btnName, titleSize),
        legend: datasetLegendOptions(),
    };
};
const createDonutChart = (btnName, data, labels, titleSize) => {
    const donutChart = new Chart("repo-lang-stats", {
        type: "doughnut",
        data: datasetDataOptions(data, labels),
        options: graphKeyOptions(btnName, titleSize),
    });

    return donutChart;
}

// our create chart function 
const loadChart = (list, btnName) => {
    let data = returnArray("data", [], list);
    let labels = returnArray("labels", [], list);

    // global style short hand
    let globalStyle = Chart.defaults.global;
    let titleSize = 50;
    setChartTextSizeFromScreenWidth(globalStyle, window.screen.width, titleSize)
    // global styles for Chart
    globalStyle.defaultColor = 'white';

    createDonutChart(btnName, data, labels, titleSize);
};