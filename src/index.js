const { resolvePath, doesPathExist, filterDirectorySync, readingFile, filterLinks, httpRequest } = require('./utils.js');
const pathInput = process.argv[2]

const mdlinks = (pathInput) => {
  return new Promise((resolve, reject) => {
    const pathResolved = resolvePath(pathInput);
    doesPathExist(pathResolved)
      .then((existingPath) => {
        const data = filterDirectorySync(existingPath);
        const allPromises = data.map(file => {
          return readingFile(file)
            .then(content => {
              const links = filterLinks(content)
              return httpRequest(file, links)
            })
            .catch(err => {
              console.error(err);
              return [];
            });
        });
        return Promise.all(allPromises);
      })
      .then((results) => {
        const flatLinks = results.flat()
        resolve(flatLinks);
      })
      .catch((err) => {
        console.error('PATH IS NOT VALID', err);
        reject(err);
      });
  });
};

const promesa = mdlinks(pathInput)
console.log(promesa, 'aqui promesa')
  promesa
  .then((result) => {
    console.log(result, 'then del resultado');
  })
  .catch((err) => {
    console.error(err, 'aqui catch del error');
  });


module.exports = {
  mdlinks,
}