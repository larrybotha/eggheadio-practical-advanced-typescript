module.exports = {
  // run doctoc only on changed markdown files
  '**/*.md': ['doctoc --github', 'git add'],
};
