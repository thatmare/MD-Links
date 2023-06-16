const axios = require('axios');
const fs = require('fs'); 
const path = require('path');

const resolvePath = (pathInput) => { // recibe input de la ruta
  const boolean = path.isAbsolute(pathInput); // isAbsolute regresa booleano si la ruta es absoluta o no
  if(!boolean) { // si es falso (es decir, es relativa)
    console.log("no es absoluta")
    return path.resolve(pathInput); // regresar la ruta resuelta a absoluta
  } else { // si es true (es absoluta)
    return pathInput; // regresar el input igual
  };
};

const doesPathExist = (pathResolved) => { // esta fx recibe la ruta resuelta a absoluta
  return new Promise((resolve, reject) => { 
    fs.access(pathResolved, (err) => { 
      if(err) {
        reject(`DOES NOT EXIST: ${pathResolved}`, err)
      } else {
        resolve(pathResolved)
      };
    });
  });
};

const isItFile = (existingPath) => {
  return new Promise((resolve, reject) => {
    fs.stat(existingPath, (err, stats) => {
      if(err) {
        reject(`COULD NOT FIND IF IT IS A FILE: ${existingPath}`, err)
      } else {
        resolve(stats.isFile())
      }
    })
  })
}

const filterDirectorySync = (existingPath) => {
  const files = fs.readdirSync(existingPath);
  const absolutePaths = files.map(file => path.join(existingPath, file));

  let foundFiles = [];

  absolutePaths.forEach(filePath => {
    const stats = fs.lstatSync(filePath);
    if (stats.isDirectory()) {
      foundFiles = foundFiles.concat(filterDirectorySync(filePath));
    }
  });

  try {
    foundFiles = foundFiles.concat(absolutePaths.filter(f => path.extname(f) === '.md'));
    return foundFiles
  } catch (err) {
    console.error(`NO .md FILES IN: ${existingPath}`, err);
  }
};

// filterDirectorySync('..//carpetaejemplo');


const readingFile = (f) => {
  return new Promise((resolve, reject) => {
    fs.readFile(f, 'utf8', (err, data) => {
      if (err) {
        reject(`COULD NOT READ FILE: ${f}`, err);
      } else {
        resolve(data);
      };
    });
  });
};

const filterLinks = (file, content) => {
  const regEx = /\[([^\]]+)\]\((http[s]?:\/\/[^\)]+)\)/g; // recupera dos grupos: texto entre corchetes y link entre paréntesis
  
  const links = Array.from(content.matchAll(regEx), matchedLink => { // crea un array a partir del contenido que hace match con la regEx
    const title = matchedLink[1]; // título es el primer grupo 
    const link = matchedLink[2]; // el link es el segundo grupo
    
    return {
      title,
      link,
      path: file,
    };
  });
  return links;
};
  
const httpRequest = (file, links) => {
  const promises = links.map(link => {
    return axios
      .get(link.link)
      .then(response => {
        return {
          title: link.title,
          link: link.link,
          path: file,
          status: response.status,
          message: response.statusText,
        }
      })
      .catch(error => {
        if (error.response) {
          return {
            title: link.title,
            link: link.link,
            path: file,
            status: error.response.status,
            message: 'FAIL',
          }
        } else if (error.request) {
          return {
            title: link.title,
            link: link.link,
            path: file,
            status: null,
            message: 'FAIL',
          }
        };
      });
  });

  return Promise.all(promises);
};

module.exports = {
  resolvePath,
  doesPathExist,
  isItFile,
  filterDirectorySync,
  readingFile,
  filterLinks,
  httpRequest,
};
