import { Octokit } from 'https://cdn.skypack.dev/@octokit/rest';

const octokit = new Octokit({
    auth: Secret.API_Token,
    userAgent: "Jeff's Stats",
    baseUrl: 'https://api.github.com',
})

// const repoActivity = await octokit.request('GET /repos/{owner}/{repo}/stats/commit_activity', {
//     owner: 'jpatterson933',
//     repo: 'resume'
// })
//     .then((res) => {
//         console.log(res);
//     })

octokit
    .paginate("GET /repos/{owner}/{repo}/stats/commit_activity", {
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