import { Octokit } from 'https://cdn.skypack.dev/@octokit/rest';

const octokit = new Octokit({
    auth: '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',
    userAgent: "Jeff's Stats",
    baseUrl: 'https://api.github.com',
})

const repoActivity = await octokit.request('GET /repos/{owner}/{repo}/stats/commit_activity', {
    owner: 'jpatterson933',
    repo: 'resume'
  })

console.log(octokit)
console.log(repoActivity)