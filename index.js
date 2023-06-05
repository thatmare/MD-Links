const { readingFile, filterDirectorySync, filterLinks } = require('./utils.js');
const pathInput = process.argv[2];

const mdlinks = (path) => {
  const data = filterDirectorySync(path);
  data.map(file => {
    const filePath = `${path}/${file}`;
    readingFile(filePath)
      .then((content) => {
        console.log(filterLinks(content))
      })
      .catch((err) => {
        console.error(err);
      })
  })
}

mdlinks(pathInput);