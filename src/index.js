import './style.css'; 
import LogoImage from './assets/logo.png'; 
import BannerBgImage from './assets/header.jpg'; 

const state = {
    pageNumber: 1,
    pageSize: 10,
    sortBy: '-published_at',
    totalItems: 0,
    totalPages: 0,
    posts: [],
};

let prevScrollPos = window.pageYOffset;
let headerIsVisible = true;

const BannerUrl = BannerBgImage;

const header = document.querySelector('.main-header');
const bannerImageWrapper = document.querySelector('.banner-image-wrapper');
const bannerContent = document.querySelector('.banner-content');
const postsContainer = document.getElementById('posts-container');
const paginationContainer = document.getElementById('pagination');
const showPerPageSelect = document.getElementById('show-per-page');
const sortBySelect = document.getElementById('sort-by');
const showingStartSpan = document.getElementById('showing-start');
const showingEndSpan = document.getElementById('showing-end');
const totalItemsSpan = document.getElementById('total-items');
const suitmediaLogo = document.getElementById('suitmedia-logo'); 

function getApiUrl() {
    const appendParams = ['small_image', 'medium_image'].map(item => `append[]=${item}`).join('&');
    const url = `/api/ideas?page[number]=${state.pageNumber}&page[size]=${state.pageSize}&${appendParams}&sort=${state.sortBy}`;
    return url;
}

function formatDate(isoString) {
    if (!isoString) return 'No Date';
    try {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options);
    } catch (e) {
        console.error("Error formatting date:", isoString, e);
        return 'Date Error';
    }
}

function createPostCard(post) {
    const card = document.createElement('div');
    card.classList.add('post-card');

    const thumbnailUrl = post.small_image?.[0]?.url || post.medium_image?.[0]?.url;

    const title = post.title || 'Untitled Post';
    const publishedAt = formatDate(post.published_at);

    card.innerHTML = `
        <div class="post-card-thumbnail">
            <img data-src="${thumbnailUrl}" alt="${title}" loading="lazy">
        </div>
        <div class="post-card-content">
            <p class="post-card-date">${publishedAt}</p>
            <h3 class="post-card-title">${title}</h3>
        </div>
    `;
    return card;
}

function renderPosts() {
    postsContainer.innerHTML = '';

    if (state.posts.length === 0) {
        postsContainer.innerHTML = '<p>No ideas found.</p>';
        return;
    }

    state.posts.forEach(post => {
        postsContainer.appendChild(createPostCard(post));
    });

    const startItem = (state.pageNumber - 1) * state.pageSize + 1;
    const endItem = Math.min(startItem + state.pageSize - 1, state.totalItems);
    showingStartSpan.textContent = startItem;
    showingEndSpan.textContent = endItem;
    totalItemsSpan.textContent = state.totalItems;
}

function renderPagination() {
    paginationContainer.innerHTML = '';

    if (state.totalPages <= 1) return;

    const maxVisiblePages = 5;
    let startPage = Math.max(1, state.pageNumber - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(state.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = state.pageNumber === 1;
    prevButton.addEventListener('click', () => {
        if (state.pageNumber > 1) {
            updateStateAndFetch({ pageNumber: state.pageNumber - 1 });
        }
    });
    paginationContainer.appendChild(prevButton);

    if (startPage > 1) {
        const firstPageButton = document.createElement('button');
        firstPageButton.textContent = '1';
        firstPageButton.addEventListener('click', () => updateStateAndFetch({ pageNumber: 1 }));
        paginationContainer.appendChild(firstPageButton);
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            paginationContainer.appendChild(ellipsis);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        if (i === state.pageNumber) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
            updateStateAndFetch({ pageNumber: i });
        });
        paginationContainer.appendChild(pageButton);
    }

    if (endPage < state.totalPages) {
        if (endPage < state.totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            paginationContainer.appendChild(ellipsis);
        }
        const lastPageButton = document.createElement('button');
        lastPageButton.textContent = state.totalPages;
        lastPageButton.addEventListener('click', () => updateStateAndFetch({ pageNumber: state.totalPages }));
        paginationContainer.appendChild(lastPageButton);
    }

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = state.pageNumber === state.totalPages;
    nextButton.addEventListener('click', () => {
        if (state.pageNumber < state.totalPages) {
            updateStateAndFetch({ pageNumber: state.pageNumber + 1 });
        }
    });
    paginationContainer.appendChild(nextButton);
}

async function fetchPosts() {
    try {
        postsContainer.innerHTML = '<p>Loading...</p>';
        paginationContainer.innerHTML = '';

        const url = getApiUrl();
        console.log("Fetching from URL:", url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });

        console.log(`API Response Status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error', code: response.status }));
            throw new Error(`HTTP error! status: ${response.status}. Message: ${errorData.message || 'No specific message from backend.'}`);
        }

        const result = await response.json();
        console.log("API Full Response Data:", result);

        if (result && result.data && Array.isArray(result.data) && result.meta) {
            state.posts = result.data;
            state.totalItems = result.meta.total;
            state.totalPages = result.meta.last_page;
            console.log(`State updated: Total items=${state.totalItems}, Total pages=${state.totalPages}`);

            renderPosts();
            renderPagination();
        } else {
            console.error("API response structure unexpected. Expected 'data' array and 'meta' object.", result);
            postsContainer.innerHTML = '<p>Received unexpected data structure from API. Please check console for details.</p>';
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
        postsContainer.innerHTML = `<p>Failed to load posts. Error: ${error.message || 'Network error'}. Please check your network connection or console for errors.</p>`;
    }
}


function updateStateAndFetch(newState) {
    if ((newState.pageSize !== undefined && newState.pageSize !== state.pageSize) ||
        (newState.sortBy !== undefined && newState.sortBy !== state.sortBy)) {
        newState.pageNumber = 1;
        console.log(`Parameter changed (${newState.pageSize ? 'PageSize' : ''}${newState.sortBy ? 'SortBy' : ''}). Resetting page to 1.`);
    }

    Object.assign(state, newState);
    updateUrlParams();
    fetchPosts();
}

function updateUrlParams() {
    const params = new URLSearchParams(window.location.search);
    params.set('page', state.pageNumber);
    params.set('size', state.pageSize);
    params.set('sort', state.sortBy);
    history.pushState(null, '', `?${params.toString()}`);
    console.log("URL updated to:", `?${params.toString()}`);
}

function getInitialStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    state.pageNumber = parseInt(params.get('page')) || 1;
    state.pageSize = parseInt(params.get('size')) || 10;
    state.sortBy = params.get('sort') || '-published_at';

    if (showPerPageSelect) {
        showPerPageSelect.value = state.pageSize;
    } else {
        console.warn("Element with ID 'show-per-page' not found during initial state setup. Check HTML.");
    }
    if (sortBySelect) {
        sortBySelect.value = state.sortBy;
    } else {
        console.warn("Element with ID 'sort-by' not found during initial state setup. Check HTML.");
    }
    console.log("Initial state from URL:", state);
}

function setupEventListeners() {
    if (showPerPageSelect) {
        showPerPageSelect.addEventListener('change', (event) => {
            updateStateAndFetch({ pageSize: parseInt(event.target.value) });
        });
    }

    if (sortBySelect) {
        sortBySelect.addEventListener('change', (event) => {
            updateStateAndFetch({ sortBy: event.target.value });
        });
    }

    if (header && bannerImageWrapper && bannerContent) {
        window.addEventListener('scroll', () => {
            const currentScrollPos = window.pageYOffset;

            if (prevScrollPos > currentScrollPos) {
                if (!headerIsVisible) {
                    header.classList.remove('hidden');
                    headerIsVisible = true;
                }
            } else {
                if (headerIsVisible && currentScrollPos > header.offsetHeight + 20) {
                    header.classList.add('hidden');
                    headerIsVisible = false;
                }
            }
            prevScrollPos = currentScrollPos;

            if (currentScrollPos > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            const scrollPercentage = currentScrollPos * 0.3;
            bannerImageWrapper.style.transform = `translateY(${scrollPercentage}px)`;
            bannerContent.style.transform = `translateY(${scrollPercentage * 0.5}px)`;
        });
    } else {
        console.warn("Warning: One or more elements for header/banner scroll effects not found. Check HTML structure for classes/IDs (main-header, banner-image-wrapper, banner-content).");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired! Starting application initialization.');

    
    if (suitmediaLogo) {
        suitmediaLogo.src = LogoImage;
        console.log("Logo image source set to:", LogoImage);
    } else {
        console.warn("Element with ID 'suitmedia-logo' not found. Logo might not appear.");
    }
   
    if (bannerImageWrapper) {
        bannerImageWrapper.style.backgroundImage = `url('${BannerUrl}')`; 
        bannerImageWrapper.style.backgroundSize = 'cover';
        bannerImageWrapper.style.backgroundPosition = 'center';
        console.log("Banner image source set to:", BannerUrl);
    } else {
        console.warn("Element with class 'banner-image-wrapper' not found. Banner background might not appear.");
    }
   

    const essentialDomElementsFound = postsContainer && paginationContainer &&
                                     showingStartSpan && showingEndSpan && totalItemsSpan;

    if (essentialDomElementsFound) {
        console.log('All essential DOM elements for post listing and pagination found. Proceeding with setup.');
        getInitialStateFromUrl();
        setupEventListeners();
        fetchPosts();
    } else {
        console.error("CRITICAL ERROR: Missing one or more essential DOM elements. Application cannot function correctly. Please verify IDs/classes in src/index.html:", {
            postsContainer: postsContainer,
            paginationContainer: paginationContainer,
            showingStartSpan: showingStartSpan,
            showingEndSpan: showingEndSpan,
            totalItemsSpan: totalItemsSpan
        });
        if (postsContainer) {
            postsContainer.innerHTML = '<p style="color: red; font-weight: bold; text-align: center;">Error: Failed to initialize application. Missing crucial page elements. Check console for details.</p>';
        } else {
            document.body.innerHTML = '<p style="color: red; font-weight: bold; padding: 20px; text-align: center;">Fatal Error: Page cannot render. Missing fundamental HTML elements. Check your browser console.</p>';
        }
    }
});