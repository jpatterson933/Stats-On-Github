// import our json files
import repoData from "./json/repoData.json" assert { type: "json" };
import languageData from "./json/chartData.json" assert { type: "json" };

// html element for chart loader
const chartLoader = document.getElementById("chart-loader");
chartLoader.style.display = "none";

// repo data consists of ids, names and creation date
console.log(repoData);
console.log(languageData);

function displayRepos(id, name) {
    const repoList = $("#repo-list");
    const button = `<button id="${id}" type="button" class="button-list" name="${name}">${name}</button>`
    repoList.append(button);
};

function repoNavBar () {
    for (let i = 0; i < repoData.length; i++) {
        // loop through our json data and create buttons
        displayRepos(repoData[i].id, repoData[i].name)
    }
};
// create our side bar
repoNavBar();
