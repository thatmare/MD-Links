const axios = require('axios')
const fs = require('fs'); // file system
const path = require('node:path');
// const pathInput = process.argv[2];

// const getExt = (f) => {
//     return path.extname(f);
// };

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

// const httpRequest = () => {
//   return new Promise((resolve, reject) => {
//     const config = {
//       method: 'head',
//       url: 'https://docs.github.com/es/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue'
//     }

//     axios(config).then((res) => {
//         resolve(res.data)
//       })
//       .catch((err) => {
//         reject(err)
//       });
//   });
// };

// httpRequest().then((status) => {
//   console.log(status);
// })
// .catch((err) => {
//   console.error(err)
// })

const filterLinks = (content) => {
    const regEx = /(http[s]?:\/\/[^\)]+)/g;
    return String(content.match(regEx));
}

const filterDirectorySync = (pathInput) => {
  try {
    const data = fs.readdirSync(pathInput);
    return data.filter(f => path.extname(f) === '.md');
  } catch (err) {
    console.error(err);
  }
}

// CON ESTA FX LOGRO CONSOLEAR LOS ARCHIVOS EN LA CARPETA RECURSIVA
// const filterDirectorySync = (pathInput) => {
//   try {
//     const files = fs.readdirSync(pathInput);
//     const mdFiles = files.filter((file) => path.extname(file) === '.md');
//     const subDirectories = files.filter((file) =>
//       fs.statSync(path.join(pathInput, file)).isDirectory()
//     );

//     const subFiles = subDirectories.reduce((acc, directory) => {
//       const subPath = path.join(pathInput, directory);
//       return [...acc, ...filterDirectorySync(subPath)];
//     }, []);

//     return [...mdFiles, ...subFiles];
//   } catch (err) {
//     console.error(err);
//     return [];
//   }
// };

// // fs.readdir(folder, function(err, data) { // consolea los archivos dentro de ./carpetaejemplo
// //     data.forEach(i => console.log(i));
// // })

// const isPathAbsolute = (pathInput) => { // output es un booleano: true si es absoluta, false si es relativa
//     return path.isAbsolute(pathInput);
// };

// const pathToAbsolute = (pathInput) => { // input es ruta relativa, output es la ruta absoluta en string
//     return path.resolve(pathInput);
// };

module.exports = {
  readingFile,
  filterDirectorySync,
  filterLinks,
};


// const Fs = require('fs');
// const Path = require('path');
// const traverseSync = dir => ({
//   path: dir,
//   children: Fs.readdirSync(dir).map(file => {
//     const path = Path.join(dir, file);
//     console.log(Fs.lstatSync(path).isDirectory()
//       ? traverseSync(path)
//       : { path });
//   })
// });

// traverseSync(process.argv[2])

let url = 'https://httpbin.org/status/404'

axios.get(url)
  .then(response => {
    console.log(`Status: ${response.status}`);
  })
  .catch(error => {
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
    } else {
      console.log('Error:', error.message);
    }
  });