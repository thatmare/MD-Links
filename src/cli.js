#!/usr/bin/env node

const { mdLinks } = require('./index.js');
const { countUniqueLinks, countBrokenLinks } = require('./utils.js')
const cfonts = require('cfonts');
const pathInput = process.argv[2];
const validateOption = process.argv.includes('--validate');
const statsOption = process.argv.includes('--stats');
const helpOption = process.argv.includes('--help');
const colors = {
    blue: '\x1b[38;5;38m',
    teal: '\x1b[38;5;43m',
    pink: '\x1b[38;5;170m',
    yellow: '\x1b[38;5;220m',
    red: '\x1b[38;5;160m',
    highlighter: '\x1b[48;5;78m',
    reset: '\x1b[0m'// Reset to default color
  };

if(helpOption) {
  cfonts.say('md-links', {
    font: 'tiny',
    gradient: ['#e9ff49', '#f186ff'],
    transitionGradient: true,
  })
  console.log(`md-links is a command-line program that identifies links in Markdown files, just as validating their HTTP status and counting them. \n \n To use md-links you must add the following information: \n \n 1. ${colors.highlighter}md-links <path>:${colors.reset} identifies the links in all Markdown files found. \n \n 2. ${colors.highlighter}md-links <path> --validate:${colors.reset} validates the HTTP status of all the links. \n \n 3. ${colors.highlighter}md-links <path> --stats:${colors.reset} counts the total and unique amount of links. \n \n 4. ${colors.highlighter}md-links <path> --validate --stats:${colors.reset} besides the total and unique amount of links, it also counts the broken links.`)
} else if(!validateOption && !statsOption) {
  mdLinks(pathInput, { validate: false })
    .then(linksArray => {
      if(linksArray.length === 0) {
        console.log(`${colors.red} No links were found.`)
      } else {
        linksArray.forEach(l => console.log(`${colors.reset}Title: ${colors.blue}${l.title} \n ${colors.reset}Link: ${colors.teal}${l.link} \n ${colors.reset}Path: ${colors.pink}${l.path} \n`));
      }
    })
    .catch(error => {
      console.error(`${colors.red}`, error.message);
    });
} else if(validateOption && !statsOption) {
    mdLinks(pathInput, { validate: true })
      .then(linksArray => {
        if(linksArray.length === 0) {
          console.log(`${colors.red} No links were found.`)
        } else {
          linksArray.forEach(l => console.log(` ${colors.reset}Title: ${colors.blue} ${l.title} \n ${colors.reset}Link: ${colors.teal}${l.link} \n ${colors.reset}Path: ${colors.pink}${l.path} \n ${colors.reset}Status: ${colors.yellow}${l.status} \n ${colors.reset}Message: ${colors.yellow}${l.message} \n`)); 
        }
      })
      .catch(error => {
        console.error(`${colors.red}`, error.message);
      });
} else if(statsOption && !validateOption) {
    mdLinks(pathInput, {validate: false})
      .then(linksArray => {
        if(linksArray.length === 0)  {
          console.log(`${colors.red} No links were found.`)  
        } else {
          console.log(` ${colors.reset}Total: ${colors.blue}${linksArray.length} \n ${colors.reset}Unique: ${colors.teal}${countUniqueLinks(linksArray)}`)
        }
      }) 
      .catch(error => {
        console.error(`${colors.red}`, error.message);
      });
} else if (statsOption && validateOption) {
    mdLinks(pathInput, {validate: true}) 
      .then(linksArray => {
        if(linksArray.length === 0)  {
          console.log(`${colors.red} No links were found.`)  
        } else {
          console.log(` ${colors.reset}Total: ${colors.blue}${linksArray.length} \n ${colors.reset}Unique: ${colors.teal}${countUniqueLinks(linksArray)} \n ${colors.reset}Broken: ${colors.red}${countBrokenLinks(linksArray)}`)
        }
      })
      .catch(error => {
        console.error(`${colors.red}`, error.message)
      });
} else {
  console.log(`Write a valid command.`)
}