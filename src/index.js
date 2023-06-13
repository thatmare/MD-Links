const { resolvePath, doesPathExist, filterDirectorySync, readingFile, filterLinks, httpRequest, isItFile } = require('./utils.js');
const pathInput = process.argv[2]

const mdlinks = (pathInput, options = { validate }) => {
  return new Promise((resolve, reject) => {
    const pathResolved = resolvePath(pathInput);
    doesPathExist(pathResolved)
      .then((existingPath) => {
        return isItFile(existingPath)
          .then((isFile) => {
            if (isFile) {
              if(options.validate === false) {
                return readingFile(existingPath)
                .then((content) => {
                  const links = filterLinks(existingPath, content);
                  resolve(links);
                })
              } else {
                return readingFile(existingPath)
                .then((content) => {
                  const links = filterLinks(existingPath, content);
                  resolve(httpRequest(existingPath, links));
                })
              }
            } else {
              if(options.validate === false) {
                const data = filterDirectorySync(existingPath);
                const allPromises = data.map(file => {
                  return readingFile(file)
                    .then(content => {
                      const links = filterLinks(file, content);
                      return links;
                    });
                });

                Promise.all(allPromises)
                  .then(results => {
                    const allLinks = results.flat();
                    resolve(allLinks);
                  });
              } else {
                const data = filterDirectorySync(existingPath);
                const allPromises = data.map(file => {
                  return readingFile(file)
                    .then(content => {
                      const links = filterLinks(file, content);
                      return httpRequest(file, links)
                    });
                });

                Promise.all(allPromises)
                  .then(results => {
                    const allLinks = results.flat();
                    resolve(allLinks);
                  });
              }
            } 
          });
      })
      .catch((err) => {
        reject(err); // rechazar la promesa de mdlinks
      });
  });
};

const promesa = mdlinks(pathInput, {validate: true})
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