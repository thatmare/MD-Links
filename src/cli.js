#!/usr/bin/env node

const { linksToAnalyze, mdLinks } = require('./index.js');
const pathInput = process.argv[2];
const validateOption = process.argv.includes('--validate');
const colors = {
    title: '\x1b[38;5;38m',    // blue
    link: '\x1b[38;5;43m',     // teal
    path: '\x1b[38;5;170m',     // pink
    status: '\x1b[38;5;220m',   // yellow
    message: '\x1b[38;5;220m',  // yellow
    reset: '\x1b[0m'      // Reset to default color
  };

linksToAnalyze(pathInput)
  .then(resultingLinks => {
    return resultingLinks;
  })
  .catch(err => {
    console.error(err);
  });

if(!validateOption) {
    mdLinks(pathInput, { validate: false })
        .then(linkObj => {
            linkObj.forEach(l => console.log(` ${colors.reset}Title: ${colors.title}${l.title} \n ${colors.reset}Link: ${colors.link}${l.link} \n ${colors.reset}Path: ${colors.path}${l.path} \n`));
        })
        .catch(err => {
            console.error('catch de validate false', err)
        })
} else {
    mdLinks(pathInput, { validate: true })
        .then(linkObj => {
            linkObj.forEach(l => console.log(` ${colors.reset}Title: ${colors.title}${l.title} \n ${colors.reset}Link: ${colors.link}${l.link} \n ${colors.reset}Path: ${colors.path}${l.path} \n ${colors.reset}Status: ${colors.status}${l.status} \n ${colors.reset}Message: ${colors.message}${l.message} \n`));
        })
        .catch(err => {
            console.error('catch de validate true', err)
        })
}

// if(!validateOption) {
//     linkObj.forEach(l => console.log(`Title: ${l.title}\n Link: ${l.link}\n Path: ${l.path} \n`));
// } else {
//     linkObj.forEach(l => console.log(`Title: ${l.title}\n Link: ${l.link}\n Path: ${l.path} \n Status: ${l.status} \n Message: ${l.message} \n`))
// }

// mdLinks({ validate: false })
//   .then(linkObj => {
//     linkObj.forEach(l => console.log(`Title: ${l.title}\n Link: ${l.link}\n Path: ${l.path}`));
//   })
//   .catch(err => {
//     console.error(err, 'aqui catch de error');
//   });