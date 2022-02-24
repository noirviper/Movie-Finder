'use strict';

//Configure animated bg
VANTA.RINGS({
  el: "#aniBg",
  mouseControls: true,
  touchControls: true,
  minHeight: 200.00,
  minWidth: 200.00,
  scale: 1.00,
  scaleMobile: 1.00,
  background: '#202428',
  color: '#f802ae'
})

//Animate the scroll indicator
TweenMax.staggerFromTo([$('.down1'),$('.down2'),$('.down3'),$('.down4')], 0.6, {autoAlpha:0}, {autoAlpha:1, repeat:-1, ease: SteppedEase, delay:1},0.2);

//Tastedive api key and url
const apiKey = '353594-Thinkful-VP8R5R8G'; 
const searchURL = 'https://tastedive.com/api/similar';

//Format the query items
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

//Display results in the DOM
function displayResults(responseJson) {
  
  $('#results-list').empty();
  if(!$.isEmptyObject(responseJson.Similar.Results)) {
  

  for (let i = 0; i < responseJson.Similar.Results.length; i++){
    $('#results-list').append(
      `<div class="game-card">
      <div class="resp-container">
          <iframe class="resp-iframe" src="${responseJson.Similar.Results[i].yUrl}" gesture="media"  allow="encrypted-media" allowfullscreen></iframe>
      </div>
      <div class="game-details">
      <h3>${responseJson.Similar.Results[i].Name}</h3>
      <p>${responseJson.Similar.Results[i].wTeaser}</p>
      <p><a href='${responseJson.Similar.Results[i].wUrl}' target="_blank">Visit their Wiki</a></p>
      </div>
      </div>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
  } else {
    $('#js-error-message').append(
      `<div>
      <h3 style="color:red">Ooops!</h3>
      <p>It seems we do not have any recommendations for you. Please try a different search.</p>
      </div>`
    )};
  
};

function getMovieRecommendation(query, maxResults=10) {
  if (maxResults >=1 && maxResults <= 20) {
  const params = {
    q : query,
    type : 'movies',
    verbose: 1,
    limit : maxResults,
    k: apiKey
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;

 fetchJsonp(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
    } else {
      alert("Results must be between 1 and 20");
    }

}

function watchForm() {
  //console.log("init");
  $('#js-error-message').html("");
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val().replace(/[ ,]+/g, "%2C");
    
   // console.log(searchTerm);
    const maxResults = $('#js-max-results').val();
    getMovieRecommendation(searchTerm, maxResults);
  });
}

function animateResults() {
  TweenMax.staggerFromTo($('.game-card'), 0.8, {autoAlpha:0}, {autoAlpha:1, ease:Power4.easeIn, delay:1},0.8);
}

$(watchForm);
