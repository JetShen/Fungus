const fs = require('fs');

function leer(testFolder,setName){
    let lista=[]
    fs.readdir(testFolder, (err,files) =>{
        files.forEach(file => {
            let tipo = file.split('.')
            if(tipo.length>1){
                console.log("----------------")
                console.log(tipo[1])
                    if(tipo[1] === "json"){
                        console.log(file)
                        lista = [...lista,file]
                    }
            }
        });
        setName(lista)
    });
    
}

export {leer};