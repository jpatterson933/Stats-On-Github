import { Octokit } from 'https://cdn.skypack.dev/@octokit/rest';

// connects us on the backend
const octokit = new Octokit({
    auth: Secret.API_Token,
    userAgent: "Jeff's Stats",
    baseUrl: 'https://api.github.com',
})

// grabs specific repository
octokit
    .paginate("GET /repos/{owner}/{repo}", {
        owner: "jpatterson933",
        repo: "resume",
    })
    .then((res) => {
        // issues is an array of all issue objects. It is not wrapped in a { data, headers, status, url } object
        // like results from `octokit.request()` or any of the endpoint methods such as `octokit.rest.issues.listForRepo()`

        console.log(res)
    });

// console.log(octokit)
// console.log(repoActivity)