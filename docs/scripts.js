const form = document.getElementById('animeForm');
const endTime = document.getElementById('endTime');
const episode = document.getElementById('episode');
const sceneTitle = document.getElementById('sceneTitle');
const sceneDescription = document.getElementById('sceneDescription');
const url = document.getElementById('url');

document.getElementById('startTime').value = '0m';
document.getElementById('endTime').value = '30m';

const tableBody = document.querySelector('#animeTable tbody');
const row = document.createElement('tr');



async function fetchAnimeList() {
    try {
        const response = await fetch('get_anime_list.php');
        const responseText = await response.text();

        if (!response.ok) {
            console.error('Error in PHP script:', responseText);
            return;
        }

        // console.log(responseText)
        const animeTitles = JSON.parse(responseText);
        // console.log('animeTitles:', animeTitles);
        const animeData = animeTitles.data;

        animeData.forEach(anime => {
          const option = document.createElement('option');
          option.value = anime.node.title;
          option.textContent = anime.node.title;
          animeList.appendChild(option);
        });
    } catch (error) {
        console.error(error);
    }
}

fetchAnimeList();

function getYoutubeVideoId(url) {
  const regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#&?]*).*/;
  const match = url.match(regex);

  if (match && match[2].length === 11) {
    return match[2];
  }
  return null;
}

function convertCustomToHMS(time) {
  const unit = time.slice(-1);
  const value = parseInt(time.slice(0, -1));

  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  switch (unit) {
    case 'h':
      hours = value;
      break;
    case 'm':
      minutes = value;
      break;
    case 's':
      seconds = value;
      break;
    default:
      return null;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function calculateDuration(start, end) {
    const startTimeArray = start.split(':');
    const endTimeArray = end.split(':');

    const startSeconds = parseInt(startTimeArray[0]) * 3600 + parseInt(startTimeArray[1]) * 60 + parseInt(startTimeArray[2]);
    const endSeconds = parseInt(endTimeArray[0]) * 3600 + parseInt(endTimeArray[1]) * 60 + parseInt(endTimeArray[2]);

    if (endSeconds <= startSeconds) {
        return null;
    }

    const durationSeconds = endSeconds - startSeconds;
    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);
    const seconds = durationSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const startTimeHMS = convertCustomToHMS(startTime.value);
    const endTimeHMS = convertCustomToHMS(endTime.value);
    const duration = calculateDuration(startTimeHMS, endTimeHMS);

    if (!duration) {
        alert('End time must be greater than start time');
        return;
    }

    const youtubeVideoId = getYoutubeVideoId(url.value);

    const urlCell = document.createElement('td');
    if (youtubeVideoId) {
        const iframe = document.createElement('iframe');
        iframe.width = 200;
        iframe.height = 113;
        iframe.src = `https://www.youtube.com/embed/${youtubeVideoId}`;
        iframe.title = 'YouTube video player';
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        urlCell.appendChild(iframe);
    } else {
        urlCell.textContent = url.value;
    }
    row.appendChild(urlCell);

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${animeList.value}</td>
        <td>${startTime.value}</td>
        <td>${endTime.value}</td>
        <td>${duration}</td>
        <td>${sceneTitle.value}</td>
        <td>${sceneDescription.value}</td>
        <td>${episode.value}</td>
    `;

    tableBody.appendChild(newRow);
    newRow.appendChild(urlCell);

    animeTable.appendChild(row);
    form.reset();
    document.getElementById('startTime').value = '0m';
    document.getElementById('endTime').value = '30m';
    document.getElementById('endTime').focus();
    document.getElementById('startTime').focus();
    // Initialize Materialize CSS select component
    M.FormSelect.init('startTime');
    M.FormSelect.init('endTime');

});
