#!/usr/bin/env node

const { mdLinks } = require('./index.js');
const { countUniqueLinks, countBrokenLinks } = require('./utils.js')
const pathInput = process.argv[2];
const validateOption = process.argv.includes('--validate');
const statsOption = process.argv.includes('--stats');
const colors = {
    blue: '\x1b[38;5;38m',
    teal: '\x1b[38;5;43m',
    pink: '\x1b[38;5;170m',
    yellow: '\x1b[38;5;220m',
    red: '\x1b[38;5;160m',
    reset: '\x1b[0m'// Reset to default color
  };

if(!validateOption && !statsOption) {
  mdLinks(pathInput, { validate: false })
    .then(linksArray => {
      linksArray.forEach(l => console.log(`${colors.reset}Title: ${colors.title}${l.title} \n ${colors.reset}Link: ${colors.teal}${l.link} \n ${colors.reset}Path: ${colors.pink}${l.path} \n`));
    })
    .catch(error => {
      console.error('catch de validate false', error);
    });
} else if(validateOption && !statsOption) {
    mdLinks(pathInput, { validate: true })
      .then(linksArray => {
        linksArray.forEach(l => console.log(` ${colors.reset}Title: ${colors.blue} ${l.title} \n ${colors.reset}Link: ${colors.teal}${l.link} \n ${colors.reset}Path: ${colors.pink}${l.path} \n ${colors.reset}Status: ${colors.yellow}${l.status} \n ${colors.reset}Message: ${colors.yellow}${l.message} \n`));
      })
      .catch(error => {
        console.error('catch de validate true', error);
      });
} else if(statsOption && !validateOption) {
    mdLinks(pathInput, {validate: false})
      .then(linksArray => {
        console.log(` ${colors.reset}Total: ${colors.blue}${linksArray.length} \n ${colors.reset}Unique: ${colors.teal}${countUniqueLinks(linksArray)}`)
      })
      .catch(error => {
        console.error('catch de stats true', error.message);
      });
} else if (statsOption && validateOption) {
    mdLinks(pathInput, {validate: true})
      .then(linksArray => {
        console.log(` ${colors.reset}Total: ${colors.blue}${linksArray.length} \n ${colors.reset}Unique: ${colors.teal}${countUniqueLinks(linksArray)} \n ${colors.reset}Broken: ${colors.red}${countBrokenLinks(linksArray)}`)
      })
      .catch(error => {
        console.error('catch de stats y validate true', error.message)
      });
};