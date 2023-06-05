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


const filterLinks = (content) => {
    const regEx = /(http[s]?:\/\/[^\)]+)/g;
    return String(content.match(regEx));
}
//buscar regex como arrojar todo dentro de ciertos caracteres
// jsdom

// const readDirectory = (folder) => {
//     return new Promise((resolve, reject) => {
//         fs.readdir(folder, (err, data) => {
//             if(err) {
//                 reject(err);
//             } else {
//                 resolve(data);
//             }
//         });
//     });
// };

// const filterDirectory = (pathInput) => {
//     return new Promise((resolve, reject) => {
//         fs.readdir(pathInput, (err, data) => {
//             if(err) {
//                 reject(err)
//             } else {
//                 resolve(data.filter(f => path.extname(f) === '.md'))
//             }
//         })
//     })
// } // recursividad: escenario de tener una carpeta dentro de esta
// Usar fx síncrona de readdirSync

const filterDirectorySync = (pathInput) => {
  try {
    const data = fs.readdirSync(pathInput);
    return data.filter(f => path.extname(f) === '.md');
  } catch (err) {
    console.error(err);
  }
}

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

// console.log(fs.existsSync(pathInput))

// const fs = require('fs')  
// // const folder = process.argv[2]  

// // const file = process.argv[2];
// // const path = require('node:path')

// const readingFile = (f) => {
//     fs.readFile(f, 'utf8', (err, data) => {
//         if(err) throw error;
//         return data;
//     })
// }

// fs.readFile(file, 'utf8', (err, data) => { // consolea las lineas de sample.md a la misma altura de la carpeta
//     console.log(data);
// })

//console.log(path.extname(file)) // consolea la extension del archivo dado sample.md
  
// fs.readFile(file, 'utf8', (err, data) => {
//  const lines = data.split('\n').length - 1;
//  console.log(lines);
// })

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