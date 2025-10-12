# Stats on Github

### [Live Application](https://deluxe-phoenix-6759a6.netlify.app/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)

A visualization dashboard that displays language usage statistics across GitHub repositories using interactive doughnut charts.

## Table of Contents

1. [Description](#description)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Scripts](#scripts)
7. [Project Structure](#project-structure)
8. [License](#license)
9. [Contact](#contact)

## Description

This application visualizes programming language statistics from GitHub repositories using the GitHub API. It fetches repository data, calculates language usage percentages, and displays them through interactive Chart.js doughnut charts with lazy loading for optimal performance.

The application uses a pre-fetch strategy where repository data is pulled once via the GitHub API and stored as JSON. This approach significantly improves performance compared to making API calls on every page load.

## Features

- **Lazy Loading**: Charts load only when scrolled into view using Intersection Observer API
- **Responsive Design**: Optimized for both desktop and mobile viewing
- **Interactive Charts**: Doughnut charts with hover effects showing language distribution
- **Data Persistence**: Repository data stored in JSON format for fast loading
- **TypeScript Support**: Modern TypeScript implementation for data fetching
- **Webpack Build**: Optimized bundle with code splitting and hot module replacement

## Tech Stack

**Frontend:**

- HTML5, CSS3, JavaScript (ES6+)
- Chart.js 2.9.4 - Data visualization
- jQuery 3.5.1 - DOM manipulation
- Webpack 5 - Module bundling

**Backend:**

- Node.js 20.x
- Express.js 5.x - Web server
- Octokit 5.x - GitHub API client

**Development:**

- TypeScript - Type-safe data fetching
- Jest - Testing framework
- Babel - JavaScript transpilation
- dotenv - Environment variable management

## Installation

1. Clone the repository:

```bash
git clone https://github.com/jpatterson933/Stats-On-Github.git
cd Stats-On-Github
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
REPO_API_KEY=your_github_token_here
PORT=8080
```

4. Fetch repository data:

```bash
npm run seed
```

5. Build the application:

```bash
npm run build
```

## Usage

### Development

```bash
npm run build && npm start
```

Visit `http://localhost:8080` to view the application.

### Updating Repository Data

To refresh the repository statistics:

```bash
npm run seed
```

This fetches the latest data from GitHub and updates `src/js/json/repoData.json`.

Then rebuild and restart the server:

```bash
npm run build && npm start
```

## Scripts

- `npm start` - Start the Express server (serves built files from dist/)
- `npm run build` - Build the application with Webpack
- `npm run seed` - Fetch repository data from GitHub API (TypeScript)
- `npm run update:data` - Update repository data (legacy Node.js script)
- `npm test` - Run Jest tests

## Project Structure

```
├── apis/
│   └── github.ts          # TypeScript GitHub API client
├── server/
│   └── index.js           # Express server
├── src/
│   ├── css/               # Stylesheets
│   ├── js/
│   │   ├── index.js       # Main application logic
│   │   └── json/
│   │       └── repoData.json  # Cached repository data
│   └── index.html         # Main HTML template
├── dist/                  # Webpack build output
├── server.js              # Legacy data fetching script
├── webpack.config.js      # Webpack configuration
└── package.json
```

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the MIT License. See the [MIT License](https://www.mit.edu/~amini/LICENSE.md) documentation for details.

## Contact

**Jeffery Patterson**
Email: designframebuildweb@gmail.com
GitHub: [@jpatterson933](https://github.com/jpatterson933)

### Links

- [Live Application](https://stats-on-github-production.up.railway.app//)
- [GitHub Repository](https://github.com/jpatterson933/Stats-On-Github)
