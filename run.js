'use strict';

const fetch = require('node-fetch');

function getConfig() {
  const [owner, name] = process.env.TRAVIS_PULL_REQUEST_SLUG.split('/');

  return {
    testUrl: process.argv[2],
    pr: {
      // Remove parseint? or change to Number
      number: parseInt(process.env.TRAVIS_PULL_REQUEST, 10),
      sha: process.env.TRAVIS_PULL_REQUEST_SHA,
    },
    repo: {
      owner,
      name,
    }
  }
}

function run(config) {
  fetch(`${process.env.CI_HOST}/run-on-chrome`, {
    method: 'POST',
    body: JSON.stringify(config),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(json => {
      console.log('Score:', json.score);
    })
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

if (process.env.TRAVIS_EVENT_TYPE === 'pull_request') {
  run(getConfig());
} else {
  console.log('Front Warden is not run for non-PR commits.');
}
