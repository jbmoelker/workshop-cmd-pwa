const args = process.argv.slice(2);
const argv = minimist(args, {
  boolean: ['comment', 'help'],
  default: {comment: true},
  alias: {help: 'h'}
});
const config = {};

if (argv.help) {
  printUsageAndExit();
}

config.testUrl = argv._[0];
if (!config.testUrl) {
  console.log('Please provide a url to test.');
  printUsageAndExit();
}

config.addComment = argv.comment;
config.minPassScore = Number(argv.score);
if (!config.addComment && !config.minPassScore) {
  console.log('Please provide a --score when using --no-comment.');
  printUsageAndExit();
}

config.runner = argv.runner || RUNNERS.chrome;
const possibleRunners = Object.keys(RUNNERS);
if (!possibleRunners.includes(config.runner)) {
  console.log(
      `Unknown runner "${config.runner}". Options: ${possibleRunners}`);
  printUsageAndExit();
}
console.log(`Using runner: ${config.runner}`);

config.pr = {
  number: parseInt(process.env.TRAVIS_PULL_REQUEST, 10),
  sha: process.env.TRAVIS_PULL_REQUEST_SHA
};

const repoSlug = process.env.TRAVIS_PULL_REQUEST_SLUG;
config.repo = {
  owner: repoSlug.split('/')[0],
  name: repoSlug.split('/')[1]
};

console.log(config);