class RepoButton {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    // Create and display our button list
    displayRepos() {
        const repoList = $("#repo-list");
        const button = `<button id="${this.id}" type="button" class="button-list" name="${this.name}">${this.name}</button>`
        repoList.append(button);
    }
};

class Language {
    constructor(language, percentage, totalBytes) {
        this.language = language;
        this.percentage = percentage;
        this.totalBytes = totalBytes;
    }
};