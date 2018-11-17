'use strict';

const yelp = require('yelp-fusion');

// Place holder for Yelp Fusion's API Key. Grab them
// from https://www.yelp.com/developers/v3/manage_app
const apiKey = 'RuHsbgxniqtfV7DI-XWX4wW95VhZ_wLmmdb-3QawAmpFyW_N6ZIjXgvG0g_2bv1Hi9RhvkKSCGo6TutyTA4-oU53EjLcReQojGmatUhm1s51mC4Gt1cjKYwzNIPwW3Yx';

const searchRequest = {
  term:'Lou Malnati’s Pizzeria',
  location: 'chicago, il'
};

const client = yelp.client(apiKey);

client.search(searchRequest).then(response => {
  const firstResult = response.jsonBody.businesses[0];
  const prettyJson = JSON.stringify(firstResult, null, 4);
  console.log(prettyJson);
}).catch(e => {
  console.log(e);
});