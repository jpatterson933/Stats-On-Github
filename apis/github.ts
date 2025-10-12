/*
  Jeffery W. Patterson
  DFBW LLC
*/
import { Octokit } from "octokit";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface LanguageData {
  [key: string]: number;
}

interface LanguagePercent {
  languageName: string;
  languagePercentage: string;
  totalBytes: number;
}

class RepositoryInformation {
  id: number;
  name: string;
  creation_date: string;
  languageData: LanguageData;
  readableDate: string;
  totalBytes: number;
  languagesPercentForRepo: LanguagePercent[];
  totalBytesPerLanguage: number[];
  languageLabels: string[];
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  pushed_at: string;
  updated_at: string;
  size: number;
  description: string | null;
  homepage: string | null;
  topics: string[];
  commit_count: number;

  constructor(
    id: number, 
    name: string, 
    creation_date: string, 
    languageData: LanguageData, 
    stargazers_count: number,
    forks_count: number,
    watchers_count: number,
    pushed_at: string,
    updated_at: string,
    size: number,
    description: string | null,
    homepage: string | null,
    topics: string[],
    commit_count: number
  ) {
    this.id = id;
    this.name = name;
    this.creation_date = creation_date;
    this.languageData = languageData;
    this.readableDate = this.createReadableDate();
    this.totalBytes = this.countTotalLanguageBytesInRepo();
    this.languagesPercentForRepo = this.getPercentOfLanguageUsedInRepo();
    this.totalBytesPerLanguage = this.getTotalBytesPerLanguage();
    this.languageLabels = this.createLanguageLabels();
    this.stargazers_count = stargazers_count;
    this.forks_count = forks_count;
    this.watchers_count = watchers_count;
    this.pushed_at = pushed_at;
    this.updated_at = updated_at;
    this.size = size;
    this.description = description;
    this.homepage = homepage;
    this.topics = topics;
    this.commit_count = commit_count;
    
    
  }

  createReadableDate(): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(this.creation_date).toLocaleDateString(undefined, options);
    return formattedDate;
  }

  countTotalLanguageBytesInRepo(): number {
    let totalLanguageBytesInRepo = 0;
    for (const [languageName, bytes] of Object.entries(this.languageData)) {
      totalLanguageBytesInRepo += Number(bytes);
    }
    return totalLanguageBytesInRepo;
  }

  getPercentOfLanguageUsedInRepo(): LanguagePercent[] {
    const languageListForRepo: LanguagePercent[] = [];
    for (const [key, value] of Object.entries(this.languageData)) {
      let percentage = (((Number(value)) / this.totalBytes) * 100).toFixed(2) + "%";
      const languageClassObjectForRepo = {
        languageName: key,
        languagePercentage: percentage,
        totalBytes: value
      };
      languageListForRepo.push(languageClassObjectForRepo);
    }
    return languageListForRepo;
  }

  getTotalBytesPerLanguage(): number[] {
    try {
      let newArray: number[] = [];
      for (let i = 0; i < this.languagesPercentForRepo.length; i++) {
        newArray.push(Number(this.languagesPercentForRepo[i].totalBytes));
      }
      return newArray;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  createLanguageLabels(): string[] {
    try {
      let newArray: string[] = [];
      for (let i = 0; i < this.languagesPercentForRepo.length; i++) {
        newArray.push(`${this.languagesPercentForRepo[i].languageName} ${this.languagesPercentForRepo[i].languagePercentage}`);
      }
      return newArray;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}

export class GithubAPI {
  private octokit: Octokit;
  private owner: string;

  constructor() {
    if (!process.env.REPO_API_KEY) {
      throw new Error("REPO_API_KEY is not defined in environment variables");
    }

    this.octokit = new Octokit({
      auth: process.env.REPO_API_KEY,
      userAgent: "Jeff's Stats",
      baseUrl: 'https://api.github.com',
    });

    this.owner = 'jpatterson933';
  }

  async getUserPublicRepositories() {
    try {
      const githubUserReposQuery = 'GET /user/repos?page=1&per_page=100';
      const userRepoData = await this.octokit.request(githubUserReposQuery, { type: 'owner' });
      return userRepoData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async fetchRepositoryLanguages(name: string) {
    try {
      const githubRepoLanguageQuery = 'GET /repos/{owner}/{repo}/languages';
      const repoLanguage = await this.octokit.request(githubRepoLanguageQuery, {
        owner: this.owner,
        repo: name
      });
      return repoLanguage;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async fetchCommitCount(name: string): Promise<number> {
    try {
      const githubRepoCommitsQuery = 'GET /repos/{owner}/{repo}/commits';
      const commits = await this.octokit.request(githubRepoCommitsQuery, {
        owner: this.owner,
        repo: name,
        per_page: 1,
        page: 1
      });

      const linkHeader = commits.headers.link;
      if (!linkHeader) {
        return commits.data.length;
      }

      const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
      return lastPageMatch ? parseInt(lastPageMatch[1], 10) : commits.data.length;
    } catch (error) {
      console.error(error);
      return 0;
    }
  }

  printCompletionPercentage(i: number, length: number) {
    const percentOfLoopCompleted = `${((i / length) * 100).toFixed(2)} % Complete`;
    console.log(percentOfLoopCompleted);
  }

  writeToFile(fileName: string, fileData: any) {
    const filePath = path.join(__dirname, "..", "src", "js", "json", fileName);
    fs.writeFile(filePath, JSON.stringify(fileData), (err) => {
      err ? console.log(err) : console.log("100% of the Data successfully saved in src/js/json Directory! \n");
    });
  }

  async grabRepoData() {
    try {
      const publicRepoData = await this.getUserPublicRepositories();
      const repoInfoArray: RepositoryInformation[] = [];

      for (let i = 0; i < publicRepoData.data.length; i++) {
        const {
          id,
          name,
          created_at,
          stargazers_count,
          forks_count,
          watchers_count,
          pushed_at,
          updated_at,
          size,
          description,
          homepage,
          topics
        } = publicRepoData.data[i];

        const repoLanguage = await this.fetchRepositoryLanguages(name);
        const commitCount = await this.fetchCommitCount(name);

        this.printCompletionPercentage(i, publicRepoData.data.length);

        const newRepoObject = new RepositoryInformation(
          id, 
          name, 
          created_at, 
          repoLanguage.data,
          stargazers_count,
          forks_count,
          watchers_count,
          pushed_at,
          updated_at,
          size,
          description,
          homepage,
          topics,
          commitCount
        );
        repoInfoArray.push(newRepoObject);
      }

      this.writeToFile("repoData.json", repoInfoArray);
      return repoInfoArray;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

// Allow running this file directly with npx tsx
if (import.meta.url === `file://${process.argv[1]}`) {
  const api = new GithubAPI();
  api.grabRepoData()
    .then(() => console.log("Repository data fetch completed!"))
    .catch((error) => console.error("Error fetching repository data:", error));
}
