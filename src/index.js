const { resolvePath, doesPathExist, isItFile, filterDirectorySync, readingFile, filterLinks, httpRequest } = require('./utils.js');
// const pathInput = process.argv[2]

const linksToAnalyze = (pathInput) => {
  return new Promise((resolve, reject) => {
  const pathResolved = resolvePath(pathInput);
  doesPathExist(pathResolved).then(existingPath => {
    return isItFile(existingPath).then(isFile => {
      if(isFile) {
        return readingFile(existingPath).then(content => {
          resolve(filterLinks(existingPath, content));
        });
      } else {
        const data = filterDirectorySync(existingPath);
        const allLinksFromDir = data.map(file => {
          return readingFile(file).then(content => {
            return filterLinks(file, content);
          });
        });
        Promise.all(allLinksFromDir).then(results => {
          resolve(results.flat());
        });
      };
    });
  })
    .catch(err => {
      reject(err);
    });
  });
};

const mdLinks = (pathInput, options = { validate }) => {
  return new Promise((resolve, reject) => {
    linksToAnalyze(pathInput).then(links => {
      if(options.validate === false || !options.validate) {
        resolve(links);
      } else {
        resolve(httpRequest(links));
      }
    })
    .catch(err => {
      reject(err);
    });
  });
};

module.exports = {
  mdLinks,
  linksToAnalyze,
}