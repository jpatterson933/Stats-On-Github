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

  constructor(id: number, name: string, creation_date: string, languageData: LanguageData) {
    this.id = id;
    this.name = name;
    this.creation_date = creation_date;
    this.languageData = languageData;
    this.readableDate = this.createReadableDate();
    this.totalBytes = this.countTotalLanguageBytesInRepo();
    this.languagesPercentForRepo = this.getPercentOfLanguageUsedInRepo();
    this.totalBytesPerLanguage = this.getTotalBytesPerLanguage();
    this.languageLabels = this.createLanguageLabels();
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
        let { id, name, created_at } = publicRepoData.data[i];

        const repoLanguage = await this.fetchRepositoryLanguages(name);

        this.printCompletionPercentage(i, publicRepoData.data.length);

        const newRepoObject = new RepositoryInformation(id, name, created_at, repoLanguage.data);
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
