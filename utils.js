const axios = require('axios');
const fs = require('fs'); // fle system
const path = require('node:path');
// const pathInput = process.argv[2];

const filterDirectorySync = (pathInput) => {
  try {
    const data = fs.readdirSync(pathInput);
    return data.filter(f => path.extname(f) === '.md');
  } catch (err) {
    console.error(err);
  }
}

const readingFile = (f) => {
    return new Promise((resolve, reject) => {
      fs.readFile(f, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };

const filterLinks = (content) => {
  const regEx = /\[([^\]]+)\]\((http[s]?:\/\/[^\)]+)\)|http[s]?:\/\/[^\s)]+/g;
  
  const links = Array.from(content.matchAll(regEx), matchedLink => {
    const title = matchedLink[1];
    const link = matchedLink[2];
    return {
      title,
      link,
    };
  });
  
  return links;
};
  
// const filterLinks = (content) => {
//     const regEx = /(http[s]?:\/\/[^\)]+)/g;
//     return content.match(regEx)
// }

// const filterLinks = (content) => {
//   const regEx = /\[([^\]]+)\]\((http[s]?:\/\/[^\)]+)\)/g;
//   const regEx = /\[([^\]]+)\]\((http[s]?:\/\/[^\)]+)\)/g;

//   const links = Array.from(content.matchAll(regEx), matchedLink => ({
//     title: matchedLink[1],
//     link: matchedLink[2],
//   }))

//   return links;
// }

const httpRequest = (url) => {
  return axios.get(url)
};

module.exports = {
  readingFile,
  filterDirectorySync,
  filterLinks,
  httpRequest,
};
