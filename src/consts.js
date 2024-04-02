"use strict"

const fs = require('fs');

const os = require('os');
const platform = os.platform();
console.log(platform);


//const SO = 'WINDOWS';
//const SO = 'LINUX';
let dirTempServerPublic;
let dirTempEEGRedeLocal;
let dirTempEEGRedeLocalFull

//if (SO == 'WINDOWS'){
    if (platform == 'win32'){
        //Windows
        dirTempEEGRedeLocalFull = `//10.0.0.71/Sistemas/api/teste/REDE_LOCAL/`;
        dirTempEEGRedeLocal = 'L:/';        
        dirTempServerPublic = `X:/`;
    
    }else if(platform == 'linux'){
        //}else{
        //Linux
        /* ! MONTAR O CAMINHO REMOTO COMPLETO NO LINUX !*/     
        dirTempEEGRedeLocalFull = `/usr/local/L/`;
        dirTempEEGRedeLocal = '/usr/local/L/';   
        /* ! MONTAR O CAMINHO REMOTO COMPLETO DA URL PUBLICADA NO LINUX !*/     
        //Certificar que esté diretório local esteja publicado na web e acessível ao servidor.
        dirTempServerPublic = `/usr/local/X/`; 
    };



//Configuração de acesso ao Banco de dados Oracle
/*
const _CONNECTION_CONFIG = {
//    user          : "RONNI_NOVELLO",
//    password      : "!#@06129192Hosp",
    user          : "SYS_APIML",
    password      : "d26m09a23",
    connectString : "10.200.200.5/orcl2.santacasadepiracicaba.com.br"
};
*/
const _CONNECTION_CONFIG = {
    //user:"RONNI_NOVELLO",
    //password:"!#@06129192Hosp",
    user:"SYS_APIML",
    password:"d26m09a23",
    //connectString : "XE"
    //connectString : "RMTESTERONNI/XE"
    connectString : "10.0.4.4/XE"
};

//definir Diretório local de logs
const dirLogServer = './logs/';

//Chave de autorização de acesso da API
const _paramsAPIML = {
    //authorization: "Basic aG9zcGl0YWxwaXJhY2ljYWJhLmFwaUBtYWlzbGF1ZG8uY29tLmJyOiEjQGNyZVY3MDkx"
    authorization: "Basic aG9zcGl0YWxwaXJhY2ljYWJhLmFwaUBtYWlzbGF1ZG8uY29tLmJyOiEjQENyZXY3MDkx"
};


//Preprar aqruivo para gravações de logs locais
const currentDate = new Date();
const year = currentDate.getFullYear(); // Get the year (YYYY)
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Get the month (MM)
const day = String(currentDate.getDate()).padStart(2, '0'); // Get the day (DD)
const formattedDate = `${year}-${month}-${day}`;
//Arquivo de log:
const filenameLogServer = `logAppML${formattedDate}.txt`;

//URL será publicada e lida pela API Mais Laudos no envio de arquivos, 
//essas urls precisam acessar o mesmo diretório dirTempPublicEEG e dirTempPublicRX.
const urlImagemDcm = ['https://portalgp.santacasadepiracicaba.com.br/filesteste/arqTempRX.jpg'];
const urlExamePdf = ['https://portalgp.santacasadepiracicaba.com.br/filesteste/arqTempEEG.pdf'];

//Diretório local para cópia de arquivos temporários.
const dirTempServerLaudo = `./models/docs/`;
const arqTempServerLaudo = `arqTempLaudo.pdf`;

//Diretório local para cópia de arquivos temporários.
const dirTempServerEEG = `./models/docs/`;
const arqTempServerEEG = `arqTempEEG.pdf`;
const dirTempPublicEEG = `${dirTempServerPublic}${arqTempServerEEG}`;

//Diretório local para cópia de arquivos temporários.
const dirTempServerRX = `./models/img/`;
const arqTempServerRX = `arqTempRX.jpg`;
const dirTempPublicRX = `${dirTempServerPublic}${arqTempServerRX}`;

//Conversão de PDF em Imagem para leitura OCR
//const dirTempEEGRedeLocal = 'L:/TESTE_EEG_ARQUIVO_REDE_LOCAL.pdf';
const dirTempEEGRedeLocalOutImage = './models/img';
const arqTempEEGRedeLocalOutImage = './models/img/tempEEGRedeLocalOut';//*Não informe a extenssão.

//Funções de validação dos serviços
function funcCheckServer(){

    let status = '';
    
//Testar conexão com o banco de dados    
    const oracledb = require('oracledb');
    let connection;

    try {
        connection = oracledb.getConnection(_CONNECTION_CONFIG);
        //const res = await connection.execute(sSql, aParams);
        //await connection.execute('commit', []);
        //connection;
    } catch (err) {        
        //throw errorFactory(err.message, 'ORA-ERR');
        status = `Atenção contate do administrador do sistema!; Verificar o banco de dados se está acessível.Erro:${err}`;
    };
    /*
    finally {
        if (connection) {
            try {
                connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    };
    */

    if (!fs.existsSync(dirTempServerPublic)) {
        status = `Atenção contate do administrador do sistema!; Verificar no servidor se o diretório ${dirTempServerPublic} está acessível.`;        

    }else if (!fs.existsSync(dirTempEEGRedeLocal)) {
        status = `Atenção contate do administrador do sistema!; Verificar no servidor se o diretório ${dirTempEEGRedeLocal} está acessível.`;       

    }else if (!fs.existsSync(dirTempServerEEG)) {
        status = `Atenção contate do administrador do sistema!; Verificar no servidor se o diretório ${dirTempServerEEG} está acessível.`;       

    }else if (!fs.existsSync(dirTempServerRX)) {
        status = `Atenção contate do administrador do sistema!; Verificar no servidor se o diretório ${dirTempServerRX} está acessível.`;       
         
    };    
    
    return status;

};

module.exports = {
    _CONNECTION_CONFIG,

    _paramsAPIML,

    dirTempServerPublic,
    urlImagemDcm,
    urlExamePdf,

    dirTempServerEEG,
    arqTempServerEEG,
    dirTempPublicEEG,
    dirTempEEGRedeLocalFull,

    dirTempServerRX,
    arqTempServerRX,
    dirTempPublicRX,

    dirLogServer,
    filenameLogServer,

    dirTempServerLaudo,
    arqTempServerLaudo,

    dirTempEEGRedeLocal,
    dirTempEEGRedeLocalOutImage,
    arqTempEEGRedeLocalOutImage,

    funcCheckServer
};

/*
const jwtSecret = 'laGksdjflkgbncxbvSDmnbewuyuewytipowueQrtjdsjhbxcGFnxzmncbjhgfD';

const IHE_User = '2';
const IHE_Pass = 'AAAKKK444777';

//Pode ser usado no servidor de Docs
/*
module.exports = {
    jwtSecret,  
    
    IHE_User,
    IHE_Pass,    
}
*/