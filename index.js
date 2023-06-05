// const { readingFile }= require('./utils.js');
// const pathInput = process.argv[2];

// // const mdlinks = (path) => {
// //   if(isPathAbsolute(path) === false) {
// //     return pathToAbsolute(path);
// //   }
// // }

// const mdlinks = (path) => {
//   readingFile(path)
// }

// console.log(mdlinks(pathInput));

const { readingFile, filterDirectory, filterLinks } = require('./utils.js');
const pathInput = process.argv[2];

const mdlinks = (path) => {
  filterDirectory(path)
    .then((data) => {
      data.forEach((file) => {
        const filePath = `${path}/${file}`
        readingFile(filePath)
          .then((content) => {
            console.log(filterLinks(content))
          })
          .catch((err) => {
            console.error(err);
          });
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

mdlinks(pathInput);


// const mdlinks = (path, ext) => {
//   filterDirectory(path, ext).then((data) => {
//     let file = data.forEach(i => i.toString())
//     console.log(readingFile(file))
//   })
//   .catch((err) => {
//     console.error(err)
//   })
// }

// const mdlinks = (path) => {
//   readingFile(path).then((data) => {
//     console.log(data)
//   })
//   .then(() => {
//     console.log(getExt(path))
//   })
//   .catch((error) => {
//     console.error(error)
//   })
// }
