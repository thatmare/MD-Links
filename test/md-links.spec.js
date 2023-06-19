const { mdLinks } = require('../src/index.js');

describe('mdLinks', () => {
  describe('when validate is false', () => {
    it('must return the links object with title, link and path', () => {
      // const pathInput = 'C://Users//maris//Desktop//carpetaejemplo';
      const pathInput = '.\\carpetaejemplo\\tale.md'
      const options = { validate: false };
      const expectedLinks = [{
        title: 'Google',
        link: 'https://www.google.com',
        path: 'C:\\Users\\maris\\Desktop\\coding\\Laboratoria\\md-links\\md-links\\carpetaejemplo\\tale.md'
      }];

      return mdLinks(pathInput, options)
        .then(links => {
          expect(links).toEqual(expectedLinks)
          links.map(link => {
            expect(link).toHaveProperty('title');
        })
    });
  });
})
})
// describe('mdLinks', () => {
//   it('must be a function', () => {
//     expect(typeof mdLinks).toBe('function');
//   });
// });



// describe('mdLinks', () => {

//   it('should...', () => {
//     console.log('FIX ME!');
//   });

// });

// mdLinks recibe dos param: pathInput y un objeto con true o false
// mdLinks retorna una promesa
// ejecuta la fx/promesa linksToAnalyze, ahi se utiliza pathInput
// con lo que se obtiene de esa promesa...

// si validate false, solo retorna un array de objetos de links

// si validate true, ejecuta una peticion http que entrega un array de objetos con status y message