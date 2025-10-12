import repositoryData from "./json/repoData.json";
import '../css/reset.css';
import '../css/spinner.css';
import '../css/style.css';

console.log('Repository data loaded:', repositoryData.length, 'repositories');

const loadedCharts = new Set();
const activeChartInstances = new Map();

function repositoryHasLanguageData(repository) {
    return repository.totalBytes > 0 &&
           repository.languageLabels.length > 0 &&
           repository.totalBytesPerLanguage.length > 0;
}

function filterRepositoriesWithData(repositories) {
    return repositories.filter(repositoryHasLanguageData);
}

const repositoriesWithData = filterRepositoriesWithData(repositoryData);
console.log('Repositories with data:', repositoriesWithData.length, 'of', repositoryData.length);

function createRepositoryCard(repository) {
    const card = document.createElement('div');
    card.className = 'repository-card';
    card.dataset.repoId = repository.id;

    const header = document.createElement('div');
    header.className = 'repository-card-header';

    const title = document.createElement('h2');
    title.className = 'repository-card-title';
    title.textContent = repository.name;

    header.appendChild(title);

    const chartWrapper = document.createElement('div');
    chartWrapper.className = 'repository-card-chart-wrapper';
    chartWrapper.innerHTML = '<div class="repository-card-chart-loading">Loading chart...</div>';

    card.appendChild(header);
    card.appendChild(chartWrapper);

    return card;
}

function renderAllRepositoryCards() {
    const container = document.getElementById('repository-cards-container');
    console.log('Container found:', container);
    console.log('Rendering', repositoriesWithData.length, 'cards');

    repositoriesWithData.forEach(repository => {
        const card = createRepositoryCard(repository);
        container.appendChild(card);
    });

    console.log('All cards rendered');
}

function createCanvasElementForCard(cardElement) {
    const chartWrapper = cardElement.querySelector('.repository-card-chart-wrapper');
    chartWrapper.innerHTML = '';

    const canvas = document.createElement('canvas');
    canvas.className = 'repository-card-canvas';
    canvas.setAttribute('role', 'img');

    chartWrapper.appendChild(canvas);

    return canvas;
}

function displayChartRenderingError(cardElement, errorMessage) {
    const chartWrapper = cardElement.querySelector('.repository-card-chart-wrapper');
    chartWrapper.innerHTML = `
        <div class="repository-card-chart-error">
            <span class="error-icon">⚠️</span>
            <p>Unable to load chart</p>
            <small>${errorMessage}</small>
        </div>
    `;
}

function generateAccessibleChartDescription(repository) {
    const languageList = repository.languageLabels
        .map((lang, index) => `${lang}: ${repository.totalBytesPerLanguage[index]} bytes`)
        .join(', ');

    return `Language distribution for ${repository.name}. ${languageList}`;
}

function findRepositoryById(repositoryId) {
    return repositoriesWithData.find(repo => repo.id == repositoryId);
}

function determineChartFontSize() {
    return window.screen.width >= 750 ? 16 : 10;
}

function determineTitleFontSize() {
    return window.screen.width >= 750 ? 28 : 14;
}
function buildChartColorScheme() {
    return {
        neonGreen: "rgba(46, 160, 67, 1)",
        brightGreen: "rgba(38, 166, 65, 1)",
        mediumGreen: "rgba(0, 109, 50, 1)",
        darkGreen: "rgba(14, 68, 41, 1)"
    };
}

function createChartDatasetConfiguration(languageData) {
    const colors = buildChartColorScheme();
    const colorValues = Object.values(colors);

    return [{
        backgroundColor: colorValues,
        hoverBackgroundColor: [...colorValues.slice(1), colorValues[0]],
        borderWidth: 2,
        borderColor: [...colorValues.slice(1), colorValues[0]],
        hoverBorderWidth: 4,
        hoverBorderColor: colorValues,
        data: languageData
    }];
}

function configureChartTitle(repositoryName, fontSize) {
    return {
        display: true,
        text: repositoryName,
        fontColor: '#e6edf3',
        fontSize: fontSize
    };
}

function configureChartLegend() {
    return {
        position: 'left',
        labels: {
            fontColor: '#e6edf3',
            padding: 12,
            fontSize: determineChartFontSize()
        }
    };
}

function buildChartConfiguration(repositoryName, languageData, languageLabels) {
    return {
        type: "doughnut",
        data: {
            labels: languageLabels,
            datasets: createChartDatasetConfiguration(languageData)
        },
        options: {
            title: configureChartTitle(repositoryName, determineTitleFontSize()),
            legend: configureChartLegend(),
            responsive: true,
            maintainAspectRatio: true
        }
    };
}

function renderChartForRepository(canvas, repository) {
    const chartConfiguration = buildChartConfiguration(
        repository.name,
        repository.totalBytesPerLanguage,
        repository.languageLabels
    );

    Chart.defaults.global.defaultFontSize = determineChartFontSize();
    Chart.defaults.global.defaultFontColor = '#e6edf3';

    const accessibleDescription = generateAccessibleChartDescription(repository);
    canvas.setAttribute('aria-label', accessibleDescription);

    return new Chart(canvas, chartConfiguration);
}

function renderChartWithErrorHandling(canvas, repository, cardElement) {
    try {
        const chartInstance = renderChartForRepository(canvas, repository);
        activeChartInstances.set(repository.id, chartInstance);
        return true;
    } catch (error) {
        console.error('Chart rendering failed for', repository.name, error);
        displayChartRenderingError(cardElement, error.message);
        return false;
    }
}

function scheduleChartRenderingForCard(card, repository) {
    requestAnimationFrame(() => {
        card.classList.add('is-visible');

        const canvas = createCanvasElementForCard(card);
        console.log('Canvas created:', canvas);

        const renderingSucceeded = renderChartWithErrorHandling(canvas, repository, card);

        if (renderingSucceeded) {
            loadedCharts.add(repository.id);
            console.log('Chart rendered for:', repository.name);
        }
    });
}

function handleCardBecameVisible(card) {
    const repositoryId = card.dataset.repoId;
    console.log('Card intersecting:', repositoryId);

    if (loadedCharts.has(repositoryId)) {
        return;
    }

    const repository = findRepositoryById(repositoryId);
    console.log('Repository found:', repository);

    if (!repository) {
        displayChartRenderingError(card, 'Repository data not found');
        return;
    }

    scheduleChartRenderingForCard(card, repository);
}

function destroyChartForRepository(repositoryId) {
    const chartInstance = activeChartInstances.get(repositoryId);

    if (chartInstance) {
        chartInstance.destroy();
        activeChartInstances.delete(repositoryId);
        loadedCharts.delete(repositoryId);
        console.log('Chart destroyed for repository:', repositoryId);
    }
}

function shouldDestroyOffScreenChart(card) {
    const rect = card.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const distanceFromViewport = Math.min(
        Math.abs(rect.bottom),
        Math.abs(rect.top - viewportHeight)
    );

    return distanceFromViewport > viewportHeight * 2;
}

function handleCardLeftViewport(card) {
    if (shouldDestroyOffScreenChart(card)) {
        const repositoryId = card.dataset.repoId;
        destroyChartForRepository(repositoryId);
    }
}

function setupIntersectionObserverForLazyLoading() {
    const observerConfiguration = {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const card = entry.target;

            if (entry.isIntersecting) {
                handleCardBecameVisible(card);
            } else {
                handleCardLeftViewport(card);
            }
        });
    }, observerConfiguration);

    const allRepositoryCards = document.querySelectorAll('.repository-card');
    console.log('Observing', allRepositoryCards.length, 'cards');
    allRepositoryCards.forEach(card => observer.observe(card));
}

function initializeApplication() {
    console.log('Initializing application...');
    console.log('DOM ready state:', document.readyState);

    renderAllRepositoryCards();
    setupIntersectionObserverForLazyLoading();

    console.log('Application initialized');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApplication);
} else {
    initializeApplication();
}