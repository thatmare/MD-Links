const { mdLinks, linksToAnalyze } = require('../src/index.js')

linksToAnalyze = jest.fn().mockResolvedValue([{
  title: 'Google', 
  link: 'https://www.google.com', 
  path: 'C:/Users/Documents/tale.md'
}]);

describe('mdLinks returns a promise which is resolved with an array of objects, depending if an HTTP request is made or not.', () => {

  it('should return an array of objects with the keys of title, link and path when validate is false', async () => {
  
    return mdLinks('C:/Users/Documents/tale.md', { validate: false}).then(result => {
      expect(linksToAnalyze).toHaveBeenCalledWith('C:/Users/Documents/tale.md');

      expect(result).toEqual([{
        title: 'Google', 
        link: 'https://www.google.com', 
        path: 'C:/Users/Documents/tale.md'
      }]);
    });

  });
});

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