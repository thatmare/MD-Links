const { resolvePath, doesPathExist, filterDirectorySync, readingFile, filterLinks, httpRequest, isItFile } = require('./utils.js');
const pathInput = process.argv[2]

const linksToAnalyze = (pathInput) => {
  return new Promise((resolve, reject) => {
  const pathResolved = resolvePath(pathInput);
  doesPathExist(pathResolved).then(existingPath => {
    return isItFile(existingPath).then(isFile => {
      if(isFile) {
        return readingFile(existingPath).then(content => {
            try {
              resolve(filterLinks(existingPath, content));
            } catch (error) {
              resolve(error.message); // Resuelve la promesa con el mensaje de error
            }
        });
      } else {
        const data = filterDirectorySync(existingPath);
        const allLinksFromDir = data.map(file => {
          return readingFile(file).then(content => {
            try {
              resolve(filterLinks(existingPath, content))
            } catch(error) {
              resolve(error.message)
            }
          });
        });
        Promise.all(allLinksFromDir).then(results => {
          resolve(results.flat())
        });
      };
    });
  })
    .catch(err => {
      reject(err)
    })  
  });
};

const mdLinks = (options = { validate }) => {
  return new Promise((resolve, reject) => {
    linksToAnalyze(pathInput).then(links => {
      if(options.validate === false || !options.validate) {
        resolve(links)
      } else {
        resolve(httpRequest(pathInput, links))
      }
    })
    .catch(err => {
      reject(err)
    })
  })
}

// linksToAnalyze('C://Users//maris//Desktop//coding//Laboratoria//md-links//md-links//carpetaejemplo//tale.md')
//   .then(result => {
//   console.log(result)
// }).catch(err => {
//   console.error(err)
// })

// const promesa = mdLinks({validate: false});
// console.log(promesa, 'aqui promesa de links')
// promesa.then(result => {
//   console.log(result, 'aqui then del resultado')
// }).catch(err => {
//   console.error(err, 'aqui catch de error')
// })

linksToAnalyze(pathInput)
  .then(result => {
    return result;
  })
  .catch(err => {
    console.error(err);
  });

const promesa = mdLinks({ validate: false });
console.log(promesa, 'aqui promesa de mdlinks');
promesa
  .then(result => {
    console.log(result, 'aqui then del resultado');
  })
  .catch(err => {
    console.error(err, 'aqui catch de error');
  });


// const promesa = linksToAnalyze(pathInput);
// console.log(promesa, 'aqui promesa de links')
// promesa.then(result => {
//   console.log(result, 'aqui then del resultado')
// }).catch(err => {
//   console.error(err, 'aqui catch de error')
// })

// const mdlinks = (pathInput, options = { validate }) => {
//   return new Promise((resolve, reject) => {
//     const pathResolved = resolvePath(pathInput);
//     doesPathExist(pathResolved)
//       .then((existingPath) => {
//         return isItFile(existingPath)
//           .then((isFile) => {
//             if (isFile) {
//               if(options.validate === false) {
//                 return readingFile(existingPath)
//                 .then((content) => {
//                   const links = filterLinks(existingPath, content);
//                   resolve(links);
//                 })
//               } else {
//                 return readingFile(existingPath)
//                 .then((content) => {
//                   const links = filterLinks(existingPath, content);
//                   resolve(httpRequest(existingPath, links));
//                 })
//               }
//             } else {
//               if(options.validate === false) {
//                 const data = filterDirectorySync(existingPath);
//                 const allPromises = data.map(file => {
//                   return readingFile(file)
//                     .then(content => {
//                       const links = filterLinks(file, content);
//                       return links;
//                     });
//                 });

//                 Promise.all(allPromises)
//                   .then(results => {
//                     const allLinks = results.flat();
//                     resolve(allLinks);
//                   });
//               } else {
//                 const data = filterDirectorySync(existingPath);
//                 const allPromises = data.map(file => {
//                   return readingFile(file)
//                     .then(content => {
//                       const links = filterLinks(file, content);
//                       return httpRequest(file, links)
//                     });
//                 });

//                 Promise.all(allPromises)
//                   .then(results => {
//                     const allLinks = results.flat();
//                     resolve(allLinks);
//                   });
//               }
//             } 
//           });
//       })
//       .catch((err) => {
//         reject(err); // rechazar la promesa de mdlinks
//       });
//   });
// };

// const promesa = mdlinks(pathInput, {validate: true})
// console.log(promesa, 'aqui promesa')
//   promesa
//   .then((result) => {
//     console.log(result, 'then del resultado');
//   })
//   .catch((err) => {
//     console.error(err, 'aqui catch del error');
//   });

// module.exports = {
//   mdlinks,
// }