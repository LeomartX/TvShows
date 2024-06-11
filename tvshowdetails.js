document.addEventListener('DOMContentLoaded', function () {
    const apiUrlBase = 'https://www.episodate.com/api/show-details?q=';
    let showData;
    let currentImageIndex = 0;

    const fetchShowDetails = async (showId) => {
        try {
            const response = await fetch(`${apiUrlBase}${showId}`);
            const data = await response.json();
            showData = data.tvShow;
            displayShowDetails();
            displaySeasonsInSelect();
            displayEpisodesBySeason("1"); 
        } catch (error) {
            console.error('Error fetching show details:', error);
        }
    };

    const displayShowDetails = () => {
        document.getElementById('show-title').textContent = showData.name;
        document.getElementById('carousel-image').src = showData.pictures[currentImageIndex];
        document.getElementById('description').innerHTML = showData.description;
        document.getElementById('genres').textContent = showData.genres.join(', ');
        document.getElementById('network').textContent = showData.network;
        document.getElementById('status').textContent = showData.status;
        document.getElementById('start-date').textContent = showData.start_date;
    };

    const groupEpisodesBySeason = (episodes) => {
        return episodes.reduce((seasons, episode) => {
            (seasons[episode.season] = seasons[episode.season] || []).push(episode);
            return seasons;
        }, {});
    };

    const displayEpisodesBySeason = (seasonNumber) => {
        const seasonsDiv = document.getElementById('episodes');
        const seasons = groupEpisodesBySeason(showData.episodes);
        seasonsDiv.innerHTML = '';

        if (seasons[seasonNumber]) {
            const seasonDiv = document.createElement('div');
            seasonDiv.classList.add('season');
            seasonDiv.dataset.season = seasonNumber;
            seasonDiv.innerHTML = `<h3>Season ${seasonNumber}</h3>`;
            seasons[seasonNumber].forEach((episode, index) => {
                const episodeDiv = document.createElement('div');
                episodeDiv.classList.add('episode');
                episodeDiv.innerHTML = `
                    <p><strong>S${seasonNumber} - Episode ${index + 1}: ${episode.name}</strong></p>
                    <p>${episode.air_date.split(' ').join('<br>')}</p>
                `;
                seasonDiv.appendChild(episodeDiv);
            });
            seasonsDiv.appendChild(seasonDiv);
        }
    };

    const displaySeasonsInSelect = () => {
        const select = document.getElementById('season-select');
        const seasons = Object.keys(groupEpisodesBySeason(showData.episodes));
        select.innerHTML = seasons.map(season => `<option value="${season}">Season ${season}</option>`).join('');
    };

    document.getElementById('prev').addEventListener('click', () => {
        currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : showData.pictures.length - 1;
        document.getElementById('carousel-image').src = showData.pictures[currentImageIndex];
    });

    document.getElementById('next').addEventListener('click', () => {
        currentImageIndex = (currentImageIndex < showData.pictures.length - 1) ? currentImageIndex + 1 : 0;
        document.getElementById('carousel-image').src = showData.pictures[currentImageIndex];
    });

    document.getElementById('season-select').addEventListener('change', function () {
        displayEpisodesBySeason(this.value);
    });

    const tvShowId = new URLSearchParams(window.location.search).get('id');
    if (tvShowId) {
        fetchShowDetails(tvShowId);
    } else {
        document.getElementById('show-title').textContent = 'TV Show not found';
    }
});
