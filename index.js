const { resolvePath, doesPathExist, filterDirectorySync, readingFile, filterLinks, httpRequest } = require('./utils.js');
const pathInput = process.argv[2];

const mdlinks = (pathInput) => {
  const pathResolved = resolvePath(pathInput);
  return doesPathExist(pathResolved)
    .then((existingPath) => {
      const data = filterDirectorySync(existingPath);
      const allPromises = data.map(file => {
        return readingFile(file)
          .then(content => {
            const links = filterLinks(content)
            return httpRequest(existingPath, links)
          })
          .catch(err => {
            console.error(err)
            return [];
          });
      })
      return Promise.all(allPromises)
    })
    .catch((err) => {
      console.error('PATH IS NOT VALID', err)
    });
};

// const mdlinks = (path) => {
//   const data = filterDirectorySync(path);
//   const allPromises = data.map(file => {
//     const filePath = `${path}/${file}`;
//     return readingFile(filePath)
//       .then((content) => { 
//         const links = filterLinks(content);
//         return httpRequest(links);
//       })
//       .catch((err) => {
//         console.error(err);
//         return [];
//       });

//   })
//   return Promise.all(allPromises)
// };

mdlinks(pathInput);
