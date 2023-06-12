#!/usr/bin/env node

// //Grab provided args.
// const [,, ...args] = process.argv

// //pront hello world provided args
// console.log(`hello world ${args}`)

const { mdlinks } = require('./index.js');
const path = process.argv[2];
const options = process.argv[3];

mdlinks(path)
    .then((result) => {
        result.forEach(i => console.log('hola', i.title))
    })