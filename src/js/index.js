import repositoryData from "./json/repoData.json";
import '../css/reset.css';
import '../css/spinner.css';
import '../css/style.css';


function appendRepositoryButton(id, name) {
    const repoList = $("#repo-list");
    const button = `<button id="${id}" type="button" class="button-list" name="${name}">${name}</button>`;
    repoList.append(button);
};
function renderRepositoryNavigationBar() {
    for (let i = 0; i < repositoryData.length; i++) {
        appendRepositoryButton(repositoryData[i].id, repositoryData[i].name);
    };
};
renderRepositoryNavigationBar();

const createCanvasElement = () => {
    const chartWrapper = $("#pie-chart");
    chartWrapper.empty();
    const pieChart = document.createElement("canvas");
    const id = document.createAttribute("id");
    id.value = "repo-lang-stats";
    pieChart.setAttributeNode(id);
    chartWrapper.append(pieChart);
};

function findRepositoryByName(repositoryName) {
    let matchingRepoObject;
    for (let i = 0; i < repositoryData.length; i++) {
        if (repositoryData[i].name === repositoryName) {
            matchingRepoObject = repositoryData[i];
            break;
        };
    };
    return matchingRepoObject;
};

function setChartFontSize() {
    if (window.screen.width >= 750) {
        return 22;

    } else if (window.screen.width <= 750) {
        return 10;
    };
};
function setTitleSize() {
    if (window.screen.width >= 750) {
        return 40;
    } else if (window.screen.width <= 750) {
        return 12;
    };
};
function createDatasetStylingOptions(data) {
    const neonGreen = "rgba(57, 211, 83, 1)";
    const green = "rgba(38, 166, 65, 1)";
    const turtleGreen = "rgba(0, 109, 50, 1)";
    const darkGreen = "rgba(14, 68, 41, 1)";

    return [{
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
        datasets: createDatasetStylingOptions(data)
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


const renderRepositoryChart = (matchingRepoData, repoName) => {
    const data = matchingRepoData.totalBytesPerLanguage;
    const labels = matchingRepoData.languageLabels;
    const globalStyle = Chart.defaults.global;
    globalStyle.defaultFontSize = setChartFontSize();
    const titleSize = setTitleSize();
    globalStyle.defaultColor = 'white';

    createDonutChart(repoName, data, labels, titleSize);
};

function findAndRenderRepository(repositoryName) {
    const matchingRepoObject = findRepositoryByName(repositoryName);
    renderRepositoryChart(matchingRepoObject, repositoryName);
};

function attachRepositoryChartClickHandler() {
    $("body").on("click", ".button-list", function (e) {
        createCanvasElement();
        const $btn = $(this);
        const repositoryName = $btn[0].name;
        findAndRenderRepository(repositoryName)
    });
};

attachRepositoryChartClickHandler();