'use strict';

// put your own value below!
const apiKey = '353594-Thinkful-G6HHBE40'; 
const searchURL = 'https://tastedive.com/api/similar';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

function displayResults(responseJson) {
  
  console.log(responseJson);
  
  $('#results-list').empty();
  // iterate through the items array
  if(!$.isEmptyObject(responseJson.Similar.Results)) {
  for (let i = 0; i < responseJson.Similar.Results.length; i++){
    
    $('#results-list').append(
      `<li>
      <div class="resp-container">
          <iframe class="resp-iframe" src="${responseJson.Similar.Results[i].yUrl}" gesture="media"  allow="encrypted-media" allowfullscreen></iframe>
      </div>
      <h3>${responseJson.Similar.Results[i].Name}</h3>
      <p>${responseJson.Similar.Results[i].wTeaser}</p>
      <p><a href='${responseJson.Similar.Results[i].wUrl}' target="_blank">Visit their Wiki</a></p>
      </li>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
  } else {
    $('#results-list').append(
      `<li>
      <h3 style="color:red">Ooops!</h3>
      <p>It seems we do not have any recommendations for you. Please try a different search.</p>
      </li>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
 
};

function getGameRecommendation(query, maxResults=10) {
  if (maxResults >=1 && maxResults <= 20) {
  const params = {
    q : 'game:'+ query,
    type : 'games',
    verbose: 1,
    limit : maxResults,
    k: apiKey
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;

  console.log(url);

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
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val().replace(/[ ,]+/g, "%2C");
    
    console.log(searchTerm);
    const maxResults = $('#js-max-results').val();
    getGameRecommendation(searchTerm, maxResults);
  });
}

$(watchForm);