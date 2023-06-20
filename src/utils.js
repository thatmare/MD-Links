const axios = require('axios');
const fs = require('fs'); 
const path = require('path');

// returns a path resolved (an absolute path)
const resolvePath = (pathInput) => { 
  const boolean = path.isAbsolute(pathInput); 
  if(!boolean) { 
    return path.resolve(pathInput); 
  } else { 
    return pathInput; 
  };
};

// checks if the path is valide or if it exists in the fs
const doesPathExist = (pathResolved) => { 
  return new Promise((resolve, reject) => { 
    fs.access(pathResolved, (err) => { 
      if(err) {
        reject(Error(`The path does not exist: ${pathResolved}`))
      } else {
        resolve(pathResolved)
      };
    });
  });
};

// checks if the path is a file or a directory
const isItFile = (existingPath) => {
  return new Promise((resolve, reject) => {
    fs.stat(existingPath, (err, stats) => {
      if(err) {
        reject(Error(`It is not a file: ${existingPath}`))
      } else {
        resolve(stats.isFile())
      }
    })
  })
}

// this fx is specific if the path is a directory
// if so, it filters the markdown files
// if there are more directories inside the directory argument, it will keep looking for md inside them
const filterDirectorySync = (existingPath) => {
  const files = fs.readdirSync(existingPath);
  const absolutePaths = files.map(file => path.join(existingPath, file));

  let foundFiles = [];

  absolutePaths.forEach(filePath => {
    const stats = fs.lstatSync(filePath);
    if (stats.isDirectory()) {
      foundFiles = foundFiles.concat(filterDirectorySync(filePath));
    } else if (path.extname(filePath) === '.md') {
      foundFiles.push(filePath);
    }
  });

  if (foundFiles.length === 0) {
    throw new Error(`No markdown files in: ${existingPath}`);
  }

  return foundFiles;
};

// gets the content of the md files
const readingFile = (f) => {
  return new Promise((resolve, reject) => {
    fs.readFile(f, 'utf8', (err, data) => {
      if (err) {
        reject(`Could not read file: ${f}`, err);
      } else {
        resolve(data);
      };
    });
  });
};

// it filters the links in an array of objects
const filterLinks = (file, content) => {
  const regEx = /\[([^\]]+)\]\((http[s]?:\/\/[^\)]+)\)/g; 
  
  const links = Array.from(content.matchAll(regEx), matchedLink => { 
    const title = matchedLink[1];  
    const link = matchedLink[2]; 
    
    return {
      title,
      link,
      path: file,
    };
  });

  return links;
};
  
// does the http request
const httpRequest = (links) => {
  const promises = links.map(link => {
    return axios
      .get(link.link)
      .then(response => {
        return {
          title: link.title,
          link: link.link,
          path: link.path,
          status: response.status,
          message: response.statusText,
        }
      })
      .catch(error => {
        if (error.response) {
          return {
            title: link.title,
            link: link.link,
            path: link.path,
            status: error.response.status,
            message: 'FAIL',
          }
        } else if (error.request) {
          return {
            title: link.title,
            link: link.link,
            path: link.path,
            status: null,
            message: 'FAIL',
          }
        };
      });
  });

  return Promise.all(promises);
};

const countUniqueLinks = (linksArray) => {
  const uniqueLinks = new Set();
  linksArray.forEach(object => uniqueLinks.add(object.link));

  return uniqueLinks.size;
};

const countBrokenLinks = (linksArray) => {
  let count = 0;
  linksArray.forEach(object => {
    if(object.status >= 400) {
      count++
    }
  })
  return count;
};

module.exports = {
  resolvePath,
  doesPathExist,
  isItFile,
  filterDirectorySync,
  readingFile,
  filterLinks,
  httpRequest,
  countUniqueLinks,
  countBrokenLinks,
};
