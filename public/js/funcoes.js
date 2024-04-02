const URL_ = 'http://localhost:3000/';
const API_URL = `${URL_}api`;
//const AUTHENTICATION_KEY = 'authentication';
const KEY_PACIENTES_QUERY = 'key_pacientes_query';
const KEY_DOCUMENTOS_QUERY = 'key_documentos_query';

const VK_Enter = 'Enter';

const getUrlParamArray = () => {
    let _urlString = window.location.href;
    let _url = new URL(_urlString);
    return _url.searchParams;        
}

const getUrlParam = paramName => {
    let _params = getUrlParamArray();
    return _params.get(paramName) ?? '';
}

const setUrlParam = (paramName, value) => {
    let url = new URL(window.location);
    (url.searchParams.has(paramName) ? url.searchParams.set(paramName, value) : url.searchParams.append(paramName, value)); 
    window.location = url;       
}

const navigateTo = (sLink) => {
    window.location.href = sLink;
}

const setKeyLocalStorage = (sKey, sVal) => localStorage.setItem(sKey, sVal);

const getKeyLocalStorage = sKey => localStorage.getItem(sKey);

const delKeyLocalStorage = sKey => localStorage.removeItem(sKey);

const clearNavigationKeys = () => {
    setKeyLocalStorage(AUTHENTICATION_KEY, '');
    setKeyLocalStorage(KEY_PACIENTES_QUERY, '');
}

const isObsoleteBrowser = () => {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) // If Internet Explorer
        return true;
    return false;
}

function isEmptyObject(obj) {
    for(let i in obj) return false; 
    return true;
}

const parseJwt = token => {
    if ((!token) || (token.length==0)) return {};
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(
            c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));
    return JSON.parse(jsonPayload);
};

const formatJsDataDDMMYY = s => {
    if (null == s || s.length < 10) return '';
    return `${s.substring(8, 10)}/${s.substring(5, 7)}/${s.substring(2, 4)}`;
}

const formatJsDataDDMMYYYY = s => {
    if (null == s || s.length < 10) return '';
    return `${s.substring(8, 10)}/${s.substring(5, 7)}/${s.substring(0, 4)}`;
}    


const formatJsDataYYYYMMDDTraco = s => {
    if (null == s || s.length < 10) return '';
    return `${s.substring(6, 10)}-${s.substring(3, 5)}-${s.substring(0, 2)}`;
}  

const formatStringDataDDMMYYYYtoJS = s => {
    try {
        let arr = s.split('/');
        return `${arr[2]}-${arr[1]}-${arr[0]}`;
    } catch {
        throw Error(`String de Data no formato incorreto! Esperado dd/mm/yyyy`);
    }
}    

const dateFromString = sData => {
    try {
        let arr = sData.split('-');
        return new Date(arr[0], arr[1]-1, arr[2]);
    } catch {
        throw Error(`String de Data no formato incorreto! Esperado yyyy-mm-dd`);
    }
}

const calculateAge = birthDate => Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10);

const delay = (fn, ms) => {
    let timer = 0
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(fn.bind(this, ...args), ms || 0)
    }
}

function padLeft(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

const extrairNumeros = s => {    
    return s.replace(/\D/g, "");    
}

const validarCPF = s => {             
    s = extrairNumeros(s);
    let soma;
    let resto;
    soma = 0;
    if (s.length!=11) return false;
    if (s == "00000000000") return false;
    if (s == "11111111111") return false;
    if (s == "22222222222") return false;
    if (s == "33333333333") return false;
    if (s == "44444444444") return false;
    if (s == "55555555555") return false;
    if (s == "66666666666") return false;
    if (s == "77777777777") return false;
    if (s == "88888888888") return false;
    if (s == "99999999999") return false;

    for (i=1; i<=9; i++) soma = soma + parseInt(s.substring(i-1, i)) * (11 - i);
    resto = (soma * 10) % 11;

    if ((resto == 10) || (resto == 11))  resto = 0;
    if (resto != parseInt(s.substring(9, 10)) ) return false;

    soma = 0;
    for (i = 1; i <= 10; i++) soma = soma + parseInt(s.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;

    if ((resto == 10) || (resto == 11))  resto = 0;
    if (resto != parseInt(s.substring(10, 11) ) ) return false;
    return true;
}

const validarCNS = s => {
    const somaPonderada = s => {        
        let soma = 0;
        for (let i = 0; i < s.length; i++)
            soma += s[i] * (15 - i);
        return soma;
    }
    if (s.match("[1-2]\\d{10}00[0-1]\\d") || s.match("[7-9]\\d{14}"))
        return somaPonderada(s) % 11 == 0;
    return false;
}

const validarNumero = s => {
    return /^\d+$/.test(s);
}

const validarNome = s => {
    //todo - 
    return s.trim() != "";
}

const validarNascimento = s => {
    //todo - 
    return s.trim() != "";
}

const validarGenero = s => {        
    return (s == "M") || (s == "F");
}

const validarConvenio = s => {
    //todo - 
    return s.trim() != "";
}

const validarData = s => {
    //todo -         
    return s.trim() != "";
}    

const validarEstabelecimentoId = s => {            
    return validarNumero(s);
}

const validarEstabelecimentoTipo = s => {        
    return validarNumero(s);
}    

const validarCNES = s => {
    if (!validarNumero(s)) return false;
    return s.trim().length == "2772310".length;
}

const validarEstabelecimentoNome = s => {
    //todo - 
    return s.trim() != "";        
}

const validarCarteirinha = s => {
    //todo - 
    return true;
}

const validarDDD = s => {   
    const ddd = s.substring(0, 2);
    if (ddd.length != 2) return false;
    return [
        "11", "12", "13", "14", "15", "16", "17", "18", "19", 
        "21", "22",       "24",             "27", "28",
        "31", "32", "33", "34", "35",       "37", "38",
        "41", "42", "43", "44", "45", "46", "47", "48", "49",
        "51",       "53", "54", "55",
        "61", "62", "63", "64", "65", "66", "67", "68", "69",
        "71",       "73", "74", "75",       "77",       "79",
        "81", "82", "83", "84", "85", "86", "87", "88", "89",
        "91", "92", "93", "94", "95", "96", "97", "98", "99"
    ].includes(ddd);        
}

const validarTelefone = s => {
    s = s.replaceAll('(', '').replaceAll(')', '').replaceAll('-', '').replaceAll(' ', '');        
    if (s.trim().length != "1934175975".length) return false;
    if (!validarNumero(s)) return false;
    if (!validarDDD(s)) return false;
    return true;         
}

const validarCelular = s => {        
    s = s.replaceAll('(', '').replaceAll(')', '').replaceAll('-', '').replaceAll(' ', '');
    if (s.trim().length != "19981764235".length) return false;        
    if (!validarNumero(s)) return false;
    if (!validarDDD(s)) return false;
    if (s.substring(2, 3) != "9") return false;        
    return true;        
}

const validarEmail = s => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(s).toLowerCase());
}

const validarEndereco = s => {
    //todo - 
    return s.trim() != "";            
}

const validarCidade = s => {
    //todo - 
    return s.trim() != "";   
}

const validarIdPerfilacesso = s => {
    return validarNumero(s);      
}

const validarConselho = s => {    
    return ["COREN", "CRN", "CRO", "CRM", "CREFITO", "CRFA", "CRAS", "CRP", "CFESS"].includes(s);        
}

const validarConselhoNumero = s => {
    return validarNumero(s);   
}

const validarUF = s => {
    return ["SP", "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"].includes(s);
}      

__imprimir = (bLandscape=false) => {    
    let css = '@page { size: '+(bLandscape ? 'landscape' : 'default')+'; margin-top:20; margin-bottom:20; margin-left:10; margin-right:10; }';
    let head = document.head || document.getElementsByTagName('head')[0];
    let style = document.createElement('style');    
    style.type = 'text/css';
    style.media = 'print';
    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);

    window.print();
} 

//ProgressBar de Aviso
const cElemProgressbarAttLaudo = document.getElementById("divProgressbarAttLaudo"); 
const cElemDivProgressBarAttLaudo = document.getElementById("divDivProgressBarAttLaudo"); 
const cElemSpamProgressBarAttLaudo = document.getElementById("spamProgressBarAttLaudo"); 
const cbtnCloseAviso = document.getElementById("btnCloseAviso");  
//Mensagens + barra de progresso
const cToastAviso = document.getElementById("toastAviso"); 
//Mensagens
//const cToastAvisoPadrao = document.getElementById("toastAvisoPadrao"); 

function funcExibirMsgSistema(pIdDiv,pMsg){

    console.log('TEste funcoes');
  
    const cInstanceToast = bootstrap.Toast.getOrCreateInstance(pIdDiv);    
    const cMsg = pMsg;
    cElemSpamProgressBarAttLaudo.innerHTML = ``;
    cElemSpamProgressBarAttLaudo.innerHTML = `<h5>${cMsg}</h5>`;  
    
    
   cToastAviso.hidden = false;

    cInstanceToast.show();
      
    setTimeout(() => { 
      cbtnCloseAviso.click();           
    }, 9000); 
  
};

const cElemSpamToastAvisoPadrao = document.getElementById("spamAvisoPadrao");
const cbtnCloseAvisoPadrao = document.getElementById("btnCloseAvisoPadrao");

const cToastAvisoPadrao = document.getElementById("toastAvisoPadrao");      

function funcExibirMsgSistemaPadrao(pIdDiv,pMsg){
  
    const cInstanceToast = bootstrap.Toast.getOrCreateInstance(pIdDiv);    
    const cMsg = pMsg;
    cElemSpamToastAvisoPadrao.innerHTML = ``;
    cElemSpamToastAvisoPadrao.innerHTML = `${cMsg}`;  
    cToastAvisoPadrao.hidden = false; 
    cInstanceToast.show();
    
  
    setTimeout(() => { 
      cbtnCloseAvisoPadrao.click();           
    }, 9000); 
  
};

/*
//Pegar dados cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};
$('#dropdownUsuarioLogado').html(getCookie('nmUser'));
*/
