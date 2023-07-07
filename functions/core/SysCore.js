// const { exec } = require("child_process");
const fs = require('fs');
const { Logs } = require("./LogCore");
const Mod = 'SysCore';

// FUNCTIONS
function LogDate() {
    // Date object initialized as per New Zealand timezone. Returns a datetime string
    let nz_date_string = new Date().toLocaleString("fr-FR", { timeZone: 'Europe/Paris' });
    return nz_date_string;
}

// function(Dossier Source, Dossier Interne)
function WriteDocs(Docs, DocsTwo) { // Ecriture du dossier data
    if (!fs.existsSync(Docs)) {
        fs.mkdirSync(Docs);
    }
    if (DocsTwo != undefined && !fs.existsSync(DocsTwo)) {
        fs.mkdirSync(DocsTwo);
    }
}

function WriteAgentData(data) {

    // Conversion
    const forkinfoJSON = JSON.stringify(data);
    const forkinfoObject = JSON.parse(forkinfoJSON);
    // Converting js object into JSON string
    // and writting to data.json file
    const dataJSON = JSON.stringify(forkinfoObject);
    // Ecriture du fichier
    WriteDocs("./data", "./data");
    fs.writeFileSync("./data/dataAgent.json", dataJSON);
}

function WriteErrorAgent(alerte, Module, description) {
    // Création du JSON
    let data = {
        "type": alerte,
        "Module": Module,
        "description": description
    }
    // Conversion
    const forkinfoJSON = JSON.stringify(data);
    const forkinfoObject = JSON.parse(forkinfoJSON);
    // Converting js object into JSON string
    // and writting to data.json file
    const dataJSON = JSON.stringify(forkinfoObject);
    // Ecriture du fichier
    fs.writeFileSync("./logs/" + alerte + "/" + Module + ".json", dataJSON);
}

function WriteLogsOsLast(data, Sondes) {
    // Conversion
    const forkinfoJSON = JSON.stringify(data);
    const forkinfoObject = JSON.parse(forkinfoJSON);
    // Converting js object into JSON string
    // and writting to data.json file
    const dataJSON = JSON.stringify(forkinfoObject);
    // Ecriture du fichier
    fs.writeFileSync("./logs/last_monitoring/" + Sondes + "_last.json", dataJSON);
}

function WriteLogs(data, Sondes) {

    // Récupération de la Date
    let date = LogDate();

    // Création de la variable
    let donnees = {
        time: date,
        data: data,
    }

    // Vérification de la présence des logs
    if (!fs.existsSync('./logs/monitoring/'+Sondes+'.json')) {
        WriteDocs("./logs", "./logs/monitoring");
        let logsDataStart = { "Monitoring": [] }
        let datainfoJSON = JSON.stringify(logsDataStart);
        let datainfoObject = JSON.parse(datainfoJSON);
        // Converting js object into JSON string
        // and writting to data.json file
        let dataJSON = JSON.stringify(datainfoObject);
        // Ecriture des logs
        fs.writeFileSync("./logs/monitoring/"+Sondes+".json", dataJSON);
    }

    // Récupération du fichier LOGS
    let logsData = fs.readFileSync("./logs/monitoring/"+Sondes+".json");
    // Mise en OBJ
    var logobj = JSON.parse(logsData);
    // PUSH TO VARIABLE
    logobj['Monitoring'].push(donnees);
    // Mise en Strg
    jsonStr = JSON.stringify(logobj);
    // Ecriture des logs
    fs.writeFileSync("./logs/monitoring/"+Sondes+".json", jsonStr);
}

function TokenSearch() {
    
    if (process.env.token == undefined || process.env.token == "") {
        // Vérification du fichier de config
        const ConfigNexus = require('../../data/config.json');
        if (ConfigNexus.token == undefined || ConfigNexus.token == "") {
            return null;
        }else{
            return ConfigNexus.token;
        }
    }else{
        // Renvoi du token
        return process.env.token;
    }
}

module.exports = { WriteDocs, WriteAgentData, WriteErrorAgent, WriteLogsOsLast, WriteLogs, TokenSearch }