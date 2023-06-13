const { resolvePath, doesPathExist, filterDirectorySync, readingFile, filterLinks, httpRequest, isItFile } = require('./utils.js');
const pathInput = process.argv[2]

// que el comportamiento x default sea arrojar los links con si title
// si validate es false llega hasta leer el archivo e imprimir los links

const mdlinks = (pathInput) => {
  return new Promise((resolve, reject) => {
    const pathResolved = resolvePath(pathInput);
    doesPathExist(pathResolved)
      .then((existingPath) => {
        return isItFile(existingPath)
          .then((isFile) => {
            if (isFile) {
              return readingFile(existingPath)
                .then((content) => {
                  const links = filterLinks(existingPath, content);
                  resolve(links);
                })
            } else {
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
            }
          });
      })
      .catch((err) => {
        reject(`${pathInput} does not exist.`, err);
      });
  });
};


// const mdlinks = (pathInput, /*options = { validate: false}*/) => {
//   return new Promise((resolve, reject) => {
//     const pathResolved = resolvePath(pathInput);
//     doesPathExist(pathResolved)
//       .then((existingPath) => {
//         return isItFile(existingPath)
//           .then((isFile) => {
//             if(isFile) {
//               return readingFile(existingPath)
//                 .then((content) => {
//                   const links = filterLinks(existingPath, content);
//                   return links;
//                 })
//             } else {
//               const data = filterDirectorySync(existingPath)
//               const allPromises = data.map(file => {
//                 return readingFile(file)
//                   .then(content => {
//                     const links = filterLinks(file, content)
//                     return links
//                   })
//               })
            
//             }

//           })
//       })
//       .catch((err) => {
//         reject(`${pathInput} does not exist.`, err)
//       })
//   })
// };

// const mdlinks = (pathInput, options = { validate: false}) => {
//   return new Promise((resolve, reject) => {
//     const pathResolved = resolvePath(pathInput);
//     doesPathExist(pathResolved)
//       .then((existingPath) => {
//         const data = filterDirectorySync(existingPath);
//         const allPromises = data.map(file => {
//           return readingFile(file)
//             .then(content => {
//               const links = filterLinks(file, content)
//               return links;
//               // return httpRequest(file, links)
//             })
//             .catch(err => {
//               console.error(err);
//               return [];
//             });
//         });

//         return Promise.all(allPromises);
//       })
//       .then((results) => {
//         const flatLinks = results.flat()
//         resolve(flatLinks);
//       })
//       .catch((err) => {
//         console.error('PATH IS NOT VALID', err);
//         reject(err);
//       });
//   });
// };

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