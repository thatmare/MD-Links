const axios = require('axios');
const fs = require('fs'); // fle system
const path = require('node:path');

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
  const regEx = /\[([^\]]+)\]\((http[s]?:\/\/[^\)]+)\)/g;
  
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
  
// const links = filterLinks('## Heading 1parrafo cualquiera[Pixar](https://www.pixar.com/error404) ## Heading 1parrafo cualquiera[Google](https://www.google.com)## Heading 1parrafo cualquiera[Google](https://www.googleeacom)');

const httpRequest = (links) => {
  const promises = links.map(link => {
    return axios
      .get(link.link)
      .then(response => {
        console.log( {
          title: link.title,
          link: link.link,
          status: response.status,
          message: response.statusText,
        });
      })
      .catch(error => {
        if (error.response) {
          console.log( {
            title: link.title,
            link: link.link,
            status: error.response.status,
            message: error.response.statusText,
          })
        } else if (error.request) {
          console.log({
            title: link.title,
            link: link.link,
            status: null,
            message: 'FAIL',
          })
        };
      });
  });

  return Promise.all(promises);
};

module.exports = {
  filterDirectorySync,
  readingFile,
  filterLinks,
  httpRequest,
};
