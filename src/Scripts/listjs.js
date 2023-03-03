const fs = require('fs');


function writer(list){
    console.log(list)
    const jsonData = JSON.stringify(list);
    fs.writeFile('data.json', jsonData, (err) => {
    if (err) throw err;
    console.log('Archivo guardado correctamente');
    });
}

function reader(callback) {
    fs.readFile('data.json', (err, data) => {
      if (err) {
        callback(err, null);
      } else {
        const list = JSON.parse(data);
        callback(null, list);
      }
    });
  }

  function writerH(list){
    console.log(list)
    const jsonData = JSON.stringify(list);
    fs.writeFile('history.json', jsonData, (err) => {
    if (err) throw err;
    console.log('Archivo guardado correctamente');
    });
}

function readerH(callback) {
    fs.readFile('history.json', (err, data) => {
      if (err) {
        callback(err, null);
      } else {
        const list = JSON.parse(data);
        callback(null, list);
      }
    });
  }





export { writer, reader, readerH, writerH};