#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const { createWorker } = require('../../');
const { json } = require('express');
const { result } = require('validate.js');

const [,, imagePath] = process.argv;
const image = path.resolve(__dirname, (imagePath || '../../tests/assets/images/teste2.png'));

console.log(`Recognizing ${image}`);

(async () => {
  const worker = await createWorker();
  const { data: { text, pdf } } = await worker.recognize(image, {textContent: "Example PDF"}, {pdf: true});
    
  /*
    const inputString = `Nome: JOAO MIGUEL MOREIRA Data Pag. 29-05-2023 Data: 29-05-2023 
    Veloc. Papel: 30 mm/s LF:083 Hz Filtro 60 Hz: Ligado No i 1 Idade: 8 anos. 
    Sexo: Masculino 10: 3005024 Hora08:58.35 Sensilidade: 10UVImm  HF:3500Hz  
    Montagem: 0. Banana leurovirtual 'wo was we 3050 pesos! wm 005 fr`;
    //const inputString = `Nome: JOAO Data: 29-05-2023`;  
*/

/*
‘Nome: JOAO MIGUEL MOREIRA Data Pag. 29-05-2023 Data: 29-05-2023 Veloc. Papel: 30 mm/s LF:083 Hz Filtro 60 Hz: Ligado No i 1
Idade: 8 anos. Sexo: Masculino 10: 3005024 Hora08:58.35 Sensilidade: 10UVImm  HF:3500Hz  Montagem: 0. Banana leurovirtual
wo was we 3050 pesos! wm 005 fr
Fore
[ "
Tas
i
- WANG Slane
Fores
fy
Fac
csp
[oe
or TN —
FU: SGU NUVI SES SES SSRIS SU SESE NN ee
Fre
x
rata
I" a"
802
Fare
Face TE a BE
car
pac)
eo
protic
*/

    //console.log(text);

    const personList = text;    

    const regexpDados = 
/Nome: (?<nome>[\w]+) | Data: (?<data>[\A-Za-z0-9_-]+)| Sexo: (?<sexo>[\w]+)| Data Pag. (?<DataPag>[\A-Za-z0-9_-]+)| Veloc. Papel: (?<VelocPapel>[\w]+)| Idade: (?<idade>[0-9]+)| ID: (?<id>[\w]+)/gm;

    for (const match of personList.matchAll(regexpDados)) {

        if (match.groups.nome){
            console.log(`Nome: ${match.groups.nome}`);
        }
        if (match.groups.data){
            console.log(`Data: ${match.groups.data}`);
        }
        if (match.groups.sexo){
            console.log(`Sexo: ${match.groups.sexo}`);
        }        
        if (match.groups.DataPag){
            console.log(`Data Pag. ${match.groups.DataPag}`);
        }
        if (match.groups.VelocPapel){
            console.log(`Veloc. Papel: ${match.groups.VelocPapel}`);
        }
        if (match.groups.idade){
            console.log(`Idade: ${match.groups.idade}`);
        }
        if (match.groups.id){
            console.log(`ID: ${match.groups.id}`);
        }

        //console.log(`${match.groups.nome} ${match.groups.data} ${match.groups.sexo}`);
        /*console.log(`${match.groups.nome}`);
        console.log(`${match.groups.data}`);
        console.log(`${match.groups.sexo}`);*/

    };


//    sInputs = inputString.split(' ');
    
    //const personList = `Nome: Joao Pag. Data: 29-05-2023`;

   // const personList = sInputs;
    //console.log(sInputs);

    //console.log(inputString.slice(1, 8));

    //console.log("AccountDB\\DB".match(/(.+)(...)$/)[1]);
    //console.log(inputString.match(/(.+)(...)$/)[1]);
    
    
    //console.log(sInputs);

    //const personList2 = `First_Name: John Veloc. Last_Name: Doe`;

    
    //const regexpDados = /Nome: (?<nome>\w+) .*Pag.|$ Data: (?<data>\w+)/gm;
//    const regexpDados = /Nome: (?<nome>[\w]+) Pag. Data: (?<data>\w+)/gm;

//const regexpDados = /Nome: (?<nome>[\w]+) Pag. Data: (?<data>[\w]+)/gm;




    /*
    const personList = `Nome: Joao Pag. Data: 29-05-2023`;
    //const personList = inputString;

    //const personList2 = `First_Name: John Veloc. Last_Name: Doe`;

    
    const regexpDados =
    /Nome: (?<nome>\w+) Pag. Data: (?<data>\w+)/gm;
    for (const match of personList.matchAll(regexpDados)) {
    console.log(`${match.groups.nome} ${match.groups.data}`);
    };
    */
  
  fs.writeFileSync('teste2.pdf', Buffer.from(pdf));
  console.log('Generate PDF: teste2.pdf');
  await worker.terminate();
})();
