const axios = require('axios');
const { mdLinks } = require('../src/index.js');
const { countBrokenLinks, countUniqueLinks, httpRequest } = require('../src/utils.js')
const pathInputFile = '.\\carpetaejemplo\\tale.md';
const pathInputDir = '.\\carpetaejemplo';

jest.mock('axios');

describe('httpRequest', () => {
  it('must return an array of objects with status 200 and message OK', () => {
    axios.get.mockResolvedValue({ status: 200, statusText: 'OK' });

    const links = [{ title: 'Google', link: 'https://www.google.com', path: 'C:/Documents/file.md' }];

    return httpRequest(links)
      .then(result => {
        expect(result).toEqual([
          { 
            title: 'Google',
            link: 'https://www.google.com',
            path: 'C:/Documents/file.md',
            status: 200,
            message: 'OK'
          }
        ])
      });
  });

  it('must return an array of objects with status 404 and message FAIL', () => {
    axios.get.mockRejectedValue({ response: { status: 404 }});

    const links = [ { title: 'Pixar', link: 'https://www.pixar.com/error404', path: 'C:/Documents/file.md' }];

    return httpRequest(links)
      .then(result => {
        expect(result).toEqual([
          { 
            title: 'Pixar',
            link: 'https://www.pixar.com/error404',
            path: 'C:/Documents/file.md',
            status: 404,
            message: 'FAIL'
          }
        ])
      })
  })

  it('must return an array of objects with status null and message FAIL', () => {
    axios.get.mockRejectedValue({ request: {} });

    const links = [ { title: 'Googleea', link: 'https://www.googleeacom', path: 'C:/Documents/file.md' }];

    return httpRequest(links)
      .then(result => {
        expect(result).toEqual([
          { 
            title: 'Googleea',
            link: 'https://www.googleeacom',
            path: 'C:/Documents/file.md',
            status: null,
            message: 'FAIL'
          }
        ])
      })
  })
})

describe('stats for mdLinks', () => {
  it('countBrokenLinks must return 2 when links have a code equal to or bigger than 400', () => {
    const linksInput = [{ status: 400 }, { status: 404 }];

    expect(countBrokenLinks(linksInput)).toEqual(2);
  });

  it('countUniqueLinks must return 1 because the links are repeated', () => {
    const linksInput = [{ link: 'https://www.pixar.com/error404' }, { link: 'https://www.pixar.com/error404' }];

    expect(countUniqueLinks(linksInput)).toEqual(1);
  });
});

describe('mdLinks', () => {
  describe('when validate is false', () => {
    it('must return the links object with title, link and path', () => {
      const falseOption = { validate: false };

      return mdLinks(pathInputFile, falseOption)
        .then(links => {
          links.map(l => {
            expect(l).toHaveProperty('title');
            expect(l).toHaveProperty('link');
            expect(l).toHaveProperty('path');
          });
        });
    });
  });

  describe('when validate is true', () => {
    jest.mock('../src/utils.js', () => ({
      ...jest.requireActual('../src/utils.js'),
      httpRequest: jest.fn(() => Promise.resolve([{
        status: 200,
      }]))
    }))

    it('must return the links object with title, link, path, status and message',  () => {
      const trueOption = { validate: true };

      return mdLinks(pathInputFile, trueOption)
        .then(links => {
          links.map(l => {
            expect(l).toHaveProperty('status');
          });
        });
    });
  });

  describe('when validate is true', () => {
    jest.mock('../src/utils.js', () => ({
      ...jest.requireActual('../src/utils.js'),
      httpRequest: jest.fn(() => Promise.reject([{
        status: 404,
        message: 'FAIL'
      }]))
    }));

    it('but the status code is 404',  () => {
      const trueOption = { validate: true };

      return mdLinks(pathInputFile, trueOption)
        .then(links => {
          links.map(l => {
            expect(l).toHaveProperty('status');
            expect(l).toHaveProperty('message');
          })
        })
    });
  })

  describe('when mdLinks receives a directory', () => {
    it('must return several objects corresponding to each link', () => {
      const falseOption = { validate: false};
      
      return mdLinks(pathInputDir, falseOption)
        .then(links => {
          links.map(l => {
            expect(l).toHaveProperty('title');
            expect(l).toHaveProperty('link');
            expect(l).toHaveProperty('path');
          })
        })
    })
  })
})


// mdLinks recibe dos param: pathInput y un objeto con true o false
// mdLinks retorna una promesa
// ejecuta la fx/promesa linksToAnalyze, ahi se utiliza pathInput
// con lo que se obtiene de esa promesa...

// si validate false, solo retorna un array de objetos de links

// si validate true, ejecuta una peticion http que entrega un array de objetos con status y message

// 