// module.exports = () => {
//   // ...
// };

const { isPathAbsolute, pathToAbsolute }= require('./utils.js');
const pathInput = process.argv[2];

const mdlinks = (path) => {
  if(isPathAbsolute(path) === false) {
    return pathToAbsolute(path);
  }
}

console.log(mdlinks(pathInput));