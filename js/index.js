// import our json files
// import repoData from "./json/repoData.json" assert { type: "json" };
import repositoryData from "./json/repoData.json" assert { type: "json" };

function displayRepos(id, name) {
    const repoList = $("#repo-list");
    const button = `<button id="${id}" type="button" class="button-list" name="${name}">${name}</button>`;
    repoList.append(button);
};
function repoNavBar() {
    for (let i = 0; i < repositoryData.length; i++) {
        // loop through our json data and create buttons
        displayRepos(repositoryData[i].id, repositoryData[i].name);
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
        grabMatchingRepoFromJson(buttonNameValue)
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
        data: data
    }];
};

const datasetTitleOptions = (repoName, titleSize) => {
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
};

const languageLabels = (newArray, repoLanguageInfoArray) => {
    try {
        for (let i = 0; i < repoLanguageInfoArray.length; i++) {
                newArray.push(`${repoLanguageInfoArray[i].languageName} ${repoLanguageInfoArray[i].languagePercentage}`);
        }
        return newArray;
    } catch (error) {
        console.error(error);
    };
};

function bytesPerLanguage(newArray, repoLanguageInfoArray) {
    try {
        for (let i = 0; i < repoLanguageInfoArray.length; i++) {
                newArray.push(Number(repoLanguageInfoArray[i].totalBytes));
        }
        console.log(newArray)
        return newArray;
    } catch (error) {
        console.error(error);
    };

}

function grabMatchingRepoFromJson(buttonValue) {
    let matchingRepoObject = returnMatchingJsonObject(buttonValue);
    let repoLanguageInfo = matchingRepoObject.languagesPercentForRepo;
    loadChart(repoLanguageInfo, buttonValue);
};

// our create chart function 
const loadChart = (repoLanguageInfo, repoName) => {
    // let data = returnArray("data", [], repoLanguageInfo);
    let data = bytesPerLanguage([], repoLanguageInfo)
    let labels = languageLabels([], repoLanguageInfo);

    // global style short hand
    let globalStyle = Chart.defaults.global;
    globalStyle.defaultFontSize = setChartFontSize();
    let titleSize = setTitleSize();
    // global styles for Chart
    globalStyle.defaultColor = 'white';

    createDonutChart(repoName, data, labels, titleSize);
};