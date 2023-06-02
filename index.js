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

const { readingFile } = require('./utils.js');
const pathInput = process.argv[2];

const mdlinks = (path) => {
  readingFile(path).then((data) => {
    console.log(data)
  })
  .catch((error) => {
    console.error(error)
  })
}

mdlinks(pathInput);

