const fs = require('fs'); // file system
const path = require('node:path');
// const pathInput = process.argv[2];

const getExt = (f) => {
    return path.extname(f);
};

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

const readDirectory = (folder) => {
    return new Promise((resolve, reject) => {
        fs.readdir(folder, (err, data) => {
            if(err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

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
  getExt,
  readDirectory,
};
