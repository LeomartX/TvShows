const tvShowList = document.querySelector("#tvshows-list");
const tvShowListItemTemplate = document
    .querySelector("#tvshowlist-item-template")
    .textContent.trim();

let currentPage = 1;
let totalPages = 0;

const pagination = document.querySelectorAll(".pagination");
const paginationPrev = document.querySelectorAll(".prev");
const paginationNext = document.querySelectorAll(".next");

paginationNext.forEach(next => {
    next.addEventListener("click", (e)=>{
        e.preventDefault();
        if (currentPage < totalPages) {
            renderMostPopularTvShows({page: currentPage + 1});
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll al inicio
        }
    });
});

paginationPrev.forEach(prev => {
    prev.addEventListener("click", (e)=>{
        e.preventDefault();
        if (currentPage > 1) {
            renderMostPopularTvShows({page: currentPage - 1});
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll al inicio
        }
    });
});

let searchTerm = "";

const searchForm = document.querySelector("#search-form");
const searchInput = searchForm.querySelector("[name='searchTerm']");
searchForm.querySelector(".clear-search").addEventListener("click", ()=>{
    searchInput.value = "";
    currentPage = 1;
    renderMostPopularTvShows({page: currentPage});
});

searchForm.addEventListener("submit", (e)=>{
    e.preventDefault();

    searchTerm = searchInput.value;

    currentPage = 1;
    renderSearchResult({search: searchTerm, page: currentPage});
});

renderMostPopularTvShows({page: currentPage});

function updateUI(){
    paginationPrev.forEach(prev => {
        if(currentPage === 1){
            prev.parentNode.classList.add("disabled");
        } else {
            prev.parentNode.classList.remove("disabled");
        }
    });
    paginationNext.forEach(next => {
        if(currentPage === totalPages){
            next.parentNode.classList.add("disabled");
        } else {
            next.parentNode.classList.remove("disabled");
        }
    });
}

function renderTvShowList(data) {
    let html = "";
    currentPage = data.page;
    totalPages = data.pages;

    for (const tvshow of data.tv_shows) {
        html += tvShowListItemTemplate
            .replace("{{image}}", tvshow.image_thumbnail_path)
            .replace("{{network}}", tvshow.network)
            .replace("{{name}}", tvshow.name)
            .replace('href=""', `href="tvshowdetails.html?id=${tvshow.id}"`); // Agregar el ID del programa a la URL
    }

    tvShowList.innerHTML = html;
    updateUI();
}

function renderMostPopularTvShows(params){
    getMostPopularTvShows(params)
    .then(renderTvShowList)
    .catch((err)=>{
        console.error(err);
    })
    .finally(()=>{});
}

function renderSearchResult(params){
    searchTvShow(params)
    .then(renderTvShowList)
    .catch((err)=>{
        console.error(err);
    })
    .finally(()=>{});
}


