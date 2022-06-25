class Repository {
    constructor(id, name, createdAt, description, lastCommit, url) {
        this.id = id;
        this.name = name;
        this.createdAt = new Date(createdAt);
        this.description = description;
        this.lastCommit = new Date(lastCommit);
        this.url = url;
    }

    repositoryCard() {
        const repoCardWrapper = $("#repo-cards");
        const card = `<div id="card">
                        <h1>${this.name}</h1>
                        <p>${this.createdAt}</p>
                        <p>${this.description}</p>
                        <p>${this.lastCommit}</p>
                        <p><a href="${this.url}" target="_blank">Check me out!</a></p>
                      </div>
                    `
        repoCardWrapper.append(card);
    }
};

class Language {
    constructor(language, percentage, totalBytes) {
        this.language = language;
        this.percentage = percentage;
        this.totalBytes = totalBytes;
    }
};