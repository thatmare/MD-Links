const { readingFile, filterDirectorySync, filterLinks, httpRequest } = require('./utils.js');
const pathInput = process.argv[2];

const mdlinks = (path) => {
  const data = filterDirectorySync(path);
  const allPromises = data.map(file => {
    const filePath = `${path}/${file}`;
    return readingFile(filePath)
      .then((content) => { 
        const links = filterLinks(content);
        return httpRequest(links);
      })
      .catch((err) => {
        console.error(err);
        return [];
      });

  })
  return Promise.all(allPromises)
  // .then(responses => {   
  //   const flattenedResponses = responses.flat();
  //   console.log(flattenedResponses)
  //     // flattenedResponses.forEach(response => {
  //     //   console.log(`Status: ${response.status}`);
  //     // });
  //   })
  //   .catch(error => {
  //     if(error.response) {
  //       console.log(`Status: ${error.response.status}`);
  //     } else {
  //       console.error(`Error:`, error.message)
  //     }
  //   });
};

mdlinks(pathInput);
