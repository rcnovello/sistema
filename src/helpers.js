"use strict"

const fs = require('fs');

/**
 * @param {String} sSql SQL script
 * @param {Array} aParams parametros do SQL
 */
const runSql = async (sSql, aParams=[]) => {
    const consts = require('./consts');
    const oracledb = require('oracledb');
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    
    oracledb.fetchAsString = [ oracledb.CLOB];
    let connection;
    try {
        connection = await oracledb.getConnection(consts._CONNECTION_CONFIG);

        /*
//Pegar sessão Oracle da conexão.        
        const sessionInfo = await connection.execute(`
            SELECT osuser, machine, program, SESSIONID
            FROM v$session
            WHERE audsid = USERENV('SESSIONID')
        `);

        console.log('Session Information:');
        console.log(sessionInfo.rows[0]);
*/

        const res = await connection.execute(sSql, aParams);        
        return res.rows;
    } catch (err) {         
        throw errorFactory(err.message, 'ORA-ERR');
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

/**
 * @param {String} sSql SQL script
 * @param {Array} aParams parametros do SQL
 */
const execSql = async (sSql, aParams=[]) => {
    const consts = require('../../config/js/consts');
    const oracledb = require('oracledb');
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    let connection;
    try {
        connection = await oracledb.getConnection(consts._CONNECTION_CONFIG);       
        const res = await connection.execute(sSql, aParams);
        await connection.execute('commit', []);
        return res;
    } catch (err) {        
        throw errorFactory(err.message, 'ORA-ERR');
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

//FUNÇÃO EXECUTA LOG
async function logSQL(dadosLogJson=[], dadosClob = null, dadosBlobHex=null){    
    
    let vDadosLogJson = dadosLogJson;
    let vUSUARIO_DB = '';
    let vUSUARIO_APLICACAO = '';
    let vOPERACAO = '';
    let vIP = '';
    let vAPLICACAO = '';

    let vDadosClob = dadosClob;
    let vHexString;

    try {
        vHexString = Buffer.from(dadosBlobHex, 'hex');
    } catch (error) {
        vHexString = null;        
    }

    vDadosLogJson.forEach(obj => {        
        vUSUARIO_DB = obj.USUARIO_DB,
        vUSUARIO_APLICACAO = obj.USUARIO_APLICACAO,
        vOPERACAO = obj.OPERACAO,
        vIP = obj.IP,
        vAPLICACAO = obj.APLICACAO
    });

    const sSql=`
    INSERT INTO API_ML_LOG(USUARIO_DB,USUARIO_APLICACAO,OPERACAO,IP,APLICACAO,DADOS_TEXTO,DADOS_BIN)
    values(
    :vUSUARIO_DB,
    :vUSUARIO_APLICACAO,
    :vOPERACAO,
    :vIP,
    :vAPLICACAO,
    :vDadosClob,
    :vDadosBlob)
    `;
    const consts = require('./consts');
    const oracledb = require('oracledb');
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    let connection;
    try {
        connection = await oracledb.getConnection(consts._CONNECTION_CONFIG);           
        const res = await connection.execute(sSql,{          
            vUSUARIO_DB: { val: vUSUARIO_DB, dir: oracledb.BIND_IN, type: oracledb.STRING },                        
            vUSUARIO_APLICACAO: { val: vUSUARIO_APLICACAO, dir: oracledb.BIND_IN, type: oracledb.STRING },
            vOPERACAO: { val: vOPERACAO, dir: oracledb.BIND_IN, type: oracledb.STRING },
            vIP: { val: vIP, dir: oracledb.BIND_IN, type: oracledb.STRING },
            vAPLICACAO: { val: vAPLICACAO, dir: oracledb.BIND_IN, type: oracledb.STRING },
            vDadosClob: { val: vDadosClob, dir: oracledb.BIND_IN, type: oracledb.CLOB },
            vDadosBlob: { val: vHexString, dir: oracledb.BIND_IN, type: oracledb.BLOB }                           
        });
        
        await connection.execute('commit', []);
        return res;
    } catch (err) {               
        //throw errorFactory(err.message, 'ORA-ERR');                
        writeLog(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {                
                //console.error(err);
                writeLog(err);
            }
        }
    };
      
};


function writeLog(paramLog = ''){

    const fs = require('fs');
    const vConsts = require("./consts");

    const filePath = vConsts.dirLogServer+vConsts.filenameLogServer;
    
    function appendToFile(data) {
    fs.appendFile(filePath, data, (err) => {
        if (err) {
            console.error(err);
        };/* else {
            console.log('Data appended to the file:', filePath);
        }*/
    });
    };
    
    const fileDescriptor = fs.openSync(filePath, 'a');

    const currentTime = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", hour12: false });
    const dataToAppend = `${currentTime},LOG: ${paramLog}\n`;
    appendToFile(dataToAppend);
    fs.closeSync(fileDescriptor);    

};


/**
 * @param {Error|any} err Erro para ser formatado
 */
function wrapResponseError(err) {
    let erro;
    let message;
    let messageDetail;
    let classe;
    let code;
    let httpCode;

    erro = err.code;
    message = err.message;
    messageDetail = '';
    classe = err.constructor.name;
    code = err.code;
    httpCode = 500;

    return {
        erro : erro,
        message : message,
        messageDetail : messageDetail,
        classe : classe,
        code : code,
        httpCode : httpCode,
    };
}

/**
 * @param {String} sMessage Mensagem de erro
 * @param {String} sCode Codigo do erro
 */
function errorFactory(sMessage, sCode) {
    let e = new Error(sMessage);
    e.code = sCode;
    writeLog(e);
    return e;
}

/**
 * @param {String} sPath Diretório que deseja criar
 */
 function makePath(sPath) {
    try {
        return fs.mkdirSync(sPath,  { recursive: true });
    } catch (err) {
        if (err.code !== 'EEXIST') throw err
    }
}

/**
 * @param {String} sDir Diretório destino
 * @param {String} sText Conteúdo do arquivo
 */
function saveTextFile(sDir, sText) {
    try {
        return fs.writeFileSync(sDir, sText);
    } catch (err) {
        if (err.code !== 'EEXIST') throw err
    }
}

/**
 * @param {String} sTargetDir Diretório destino
 * @param {String} sSourceDir Diretório origem
 */
function saveFile(sTargetDir, sSourceDir) {
    try {
        return fs.copyFileSync(sSourceDir, sTargetDir) && fs.unlinkSync(sSourceDir);
    } catch (err) {
        if (err.code !== 'EEXIST') throw err
    }
}

/**
 * @param {String} sDir Diretório do arquivo
 */
function deleteFile(sDir) {
    try {
        return fs.unlinkSync(sDir);
    } catch (err) {
        return err;
    }
}

/**
 * @param {Date} dData Data para ser formatada
 */
function yyyymmddNow(dData) {
    const dateFormat = require('dateformat');
    return dateFormat(dData, 'yyyymmdd');
}

/**
 * @param {Date} dDataHora Data para ser formatada
 */
function yyyymmddhhMMssNow(dDataHora) {
    const dateFormat = require('dateformat');
    return dateFormat(dDataHora, 'yyyymmddhhMMss');
}

/**
 */
 function yyyymmddhhMMssSSSNow() {
    const dateFormat = require('dateformat');
    return dateFormat(new Date(), 'yyyymmddhhMMssSSS');
}


/**
 * @param {String} sData Data no formato ISO (yyyy-mm-dd)
 */
function dateFromString(sData) {
    try {
        let arr = sData.split('-');
        return new Date(arr[0], arr[1]-1, arr[2]);
    } catch {
        throw errorFactory('String de Data no formato incorreto! Esperado yyyy-mm-dd', 'INVDATE');
    }
}

const getCurrentTimeStamp = () => {
    return Math.floor(Date.now() / 1000);
}

const padLeft = (number, digits) => {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

const strIsNullOrEmpty = (v) => {
    return (v == null || v == '')
}

function getIpv4(ip){
    let vIP = '127.0.0.1';
    try{vIP = ip.match(/(\d+\.\d+\.\d+\.\d+)/)[0];        
    }
    catch{
        return vIP;
    }

    return vIP;
};

module.exports = {
    runSql,
    execSql,
    logSQL,

    wrapResponseError,
    errorFactory,

    makePath, 
    saveTextFile,   
    saveFile,
    deleteFile,   

    yyyymmddNow,
    yyyymmddhhMMssNow,
    yyyymmddhhMMssSSSNow,
    dateFromString,   
    
    getCurrentTimeStamp,

    padLeft,

    strIsNullOrEmpty,

    getIpv4,

    writeLog
}