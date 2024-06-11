const API_BASE_URL = 'https://www.episodate.com'

function getMostPopularTvShows(params){
    const query = new URLSearchParams();
    if(params !== undefined){
        query.set("page", params.page);
    }
    return fetch(`${API_BASE_URL}/api/most-popular?${query.toString()}`)
    .then((response) =>{
        if (response.ok) return response.json();
    });
}

function searchTvShow(params){
    
    const query = new URLSearchParams();
    if(params !== undefined){
        query.set("page", params.page);
        query.set("q", params.search);
    }

    return fetch(`${API_BASE_URL}/api/search?${query.toString()}}`)
    .then((response) =>{
        if (response.ok) return response.json();
    });
}