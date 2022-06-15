import { Octokit } from 'https://cdn.skypack.dev/@octokit/rest';

// connects us on the backend
const octokit = new Octokit({
    auth: Secret.API_Token,
    userAgent: "Jeff's Stats",
    baseUrl: 'https://api.github.com',
});

const repositories = await octokit.request('GET /user/repos?page=1&per_page=1000', { type: 'owner'});
console.log(repositories.data)

// grabs specific repository
octokit
    .paginate("GET /repos/{owner}/{repo}", {
        owner: "jpatterson933",
        repo: "resume",
    })
    .then((res) => {

        console.log(res)
    });
/*--------------------------------------------------------------- */
// returns languages of specific repository in bytes - 1 byte is enough to hold about 1 typed character, e.g. 'b' or 'X' or '$'
octokit
    .paginate("GET /repos/{owner}/{repo}/languages", {
        owner: "jpatterson933",
        repo: "resume",
    })
    .then((res) => {


        console.log(res)
    });
