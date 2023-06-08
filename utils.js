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
  
const links = filterLinks('## Heading 1parrafo cualquiera[Pixar](https://www.pixar.com/error404) ## Heading 1parrafo cualquiera[Google](https://www.google.com)');

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

// const httpRequest = (url) => {
//   return axios.get(url)
//     .then((response) => {
//       console.log(response.status)
//     })
//     .catch((error) => {
//       console.error(error.response.status)
//     })
// };

// const httpRequest = (link) => {
//   return axios.get(link)
//     .then((response) => {
//       if(response.status === 200) {
//         return {...link, status: response.status, message: 'OK'}
//       }
//     })
//     .catch((error) => {
//       return {...link, status: error.response.status, message: 'FAIL'}
//     })
// };

// const httpRequest = (links) => {
//   return Promise.all(links.forEach(link => {
//     return axios.get(link.link)
//     .then(response => {
//       return {
//         title: link.title,
//         link: link.link,
//         status: response.status,
//         message: 'OK',
//       };
//     })
//     .catch(error => {
//       return {
//         title: link.title,
//         link: link.link,
//         status: error.response.status,
//         message: 'FAIL',
//       }
//     })
//   }))
// };

const httpRequest = (links) => {
  const promises = links.map(link => {
    return axios
      .get(link.link)
      .then(response => {
        console.log( {
          title: link.title,
          link: link.link,
          status: response.status,
          message: 'OK',
        });
      })
      .catch(error => {
        console.log( {
          title: link.title,
          link: link.link,
          status: error.response.status,
          message: 'FAIL',
        });
      });
  });

  return Promise.all(promises);
};

module.exports = {
  readingFile,
  filterDirectorySync,
  filterLinks,
};
