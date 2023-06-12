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
        reject(err)
      } else {
        resolve(pathResolved)
      };
    });
  });
};

const filterDirectorySync = (existingPath) => { // para filtrar archivos en el directorio, recibe una ruta existente
  try {
    const files = fs.readdirSync(existingPath); // retorna todos los archivos del directorio
    const absolutePaths = files.map(file => path.join(existingPath, file)); // para cada archivo, une la ruta absoluta con el archivo
    return absolutePaths.filter(f => path.extname(f) === '.md'); // retorna los archivos filtrados
  } catch (err) {
    console.error(err);
    // regresar a poner escenario donde no hay archivos md
  };
};

const readingFile = (f) => {
  return new Promise((resolve, reject) => {
    fs.readFile(f, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      };
    });
  });
};

const filterLinks = (content) => {
  const regEx = /\[([^\]]+)\]\((http[s]?:\/\/[^\)]+)\)/g; // recupera dos grupos: texto entre corchetes y link entre paréntesis
  
  const links = Array.from(content.matchAll(regEx), matchedLink => { // crea un array a partir del contenido que hace match con la regEx
    const title = matchedLink[1]; // título es el primer grupo 
    const link = matchedLink[2]; // el link es el segundo grupo
    return {
      title,
      link,
    };
  });
  return links;
  // console.log(links)
};
  
// filterLinks('## Heading 2 [Vincular una solicitud de cambios a una propuesta](https://docs.github.com/es/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue)')

// // ----------------------------------------------------------------node index.js
// const httpRequest = (existingPath, links) => {
//   const promises = links.map(link => {
//     return axios
//       .get(link.link)
//       .then(response => {
//         console.log( {
//           title: link.title,
//           link: link.link,
//           path: existingPath, // arrojar la ruta con el archivo también?
//           status: response.status,
//           message: response.statusText,
//         });
//       })
//       .catch(error => {
//         if (error.response) {
//           console.log( {
//             title: link.title,
//             link: link.link,
//             path: existingPath,
//             status: error.response.status,
//             message: error.response.statusText,
//           })
//         } else if (error.request) {
//           console.log({
//             title: link.title,
//             link: link.link,
//             path: existingPath,
//             status: null,
//             message: 'FAIL',
//           })
//         };
//       });
//   });

//   return Promise.all(promises);
// };

// const ejemplo = [
//   {
//     title: 'Vincular una solicitud de cambios a una propuesta',
//     link: 'https://docs.github.com/es/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue'
//   },
//   {
//     title: 'Vincular una solicitud de cambios a una propuesta',
//     link: 'https://docs.github.com/es/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue'
//   },
// ]

// console.log(httpRequest(ejemplo))

// ---------------------------------------------------------------------md-links cli
const httpRequest = (existingPath, links) => {
  const promises = links.map(link => {
    return axios
      .get(link.link)
      .then(response => {
        return {
          title: link.title,
          link: link.link,
          path: existingPath, // arrojar la ruta con el archivo también?
          status: response.status,
          message: response.statusText,
        };
      })
      .catch(error => {
        if (error.response) {
          return {
            title: link.title,
            link: link.link,
            path: existingPath,
            status: error.response.status,
            message: error.response.statusText,
          }
        } else if (error.request) {
          return {
            title: link.title,
            link: link.link,
            path: existingPath,
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
  filterDirectorySync,
  readingFile,
  filterLinks,
  httpRequest,
};
