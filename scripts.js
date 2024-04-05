// Create one card from item data.
function createCardElement(item) {
  return `
      <li class="card">
          <img src=${item.image} alt="">
          <div class="card-content">
              <p class="subheader">
                  ${item.subtitle}
              </p>
              <h3 class="header">
                  ${item.title}
              </h3>
          </div>
      </li>
    `;
}

// Create multiple cards from array of item data.
function createCardElements(data) {
  return data.map(createCardElement).join("");
}

// Fetch NASA API
async function fetchNASAData(endpoint) {
  const apiKey = 'fy0G6eLO8PTieg7mgWnbki93GceUiYILvpc1hq6M';
  let apiUrl;

  switch (endpoint) {
    case 'apod':
      apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;
      break;
    case 'mars-photos':
      const apiUrl1 = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&camera=fhaz&api_key=${apiKey}`;
      const apiUrl2 = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=2&api_key=${apiKey}`;
      const response1 = await fetch(apiUrl1);
      const response2 = await fetch(apiUrl2);
      const data1 = await response1.json();
      const data2 = await response2.json();
      return { photos: [...data1.photos, ...data2.photos] };
    case 'epic':
      apiUrl = `https://api.nasa.gov/EPIC/api/natural?api_key=${apiKey}`;
      break;
    default:
      return;
  }

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Render NASA cards based on endpoint
async function renderNASACards(selectedEndpoint) {
  const data = await fetchNASAData(selectedEndpoint);
  let cards = '';

  switch (selectedEndpoint) {
    case 'apod':
      cards = createCardElement({
        title: data.title,
        image: data.url,
        subtitle: data.date,
      });
      break;
    case 'mars-photos':
      cards = createCardElements(
        data.photos.map((photo) => ({
          title: `Curiosity Rover Photo`,
          image: photo.img_src,
          subtitle: photo.earth_date,
        }))
      );
      break;
    case 'epic':
      cards = createCardElements(
        data.map((image) => ({
          title: `Earth Polychromatic Imaging Camera`,
          image: `https://epic.gsfc.nasa.gov/archive/natural/${image.date.split(' ')[0].replace(/-/g, '/')}/png/${image.image}.png`,
          subtitle: image.date,
        }))
      );
      break;
  }

  document.getElementById('option-2-results').innerHTML = cards;
}

//Event listener for submit button
const nasaApiSubmitButton = document.getElementById('nasa-api-submit-button');
nasaApiSubmitButton.addEventListener('click', () => {
  const selectedEndpoint = document.getElementById('nasa-api-select').value;
  renderNASACards(selectedEndpoint);
});
