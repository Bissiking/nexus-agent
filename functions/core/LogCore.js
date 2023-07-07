const fs = require('fs');
const { WriteDocs } = require('./SysCore');

// FUNCTIONS
function LogDate() {
    // Date object initialized as per New Zealand timezone. Returns a datetime string
    let nz_date_string = new Date().toLocaleString("fr-FR", { timeZone: 'Europe/Paris' });
    return nz_date_string;
}

function LogWriter(logPush) {
    // Vérification de la présence des logs
    if (!fs.existsSync('./logs/logs.json')) {
        WriteDocs("./logs", "./logs");
        let logsDataStart = { "Logs": [] }
        let datainfoJSON = JSON.stringify(logsDataStart);
        let datainfoObject = JSON.parse(datainfoJSON);
        // Converting js object into JSON string
        // and writting to data.json file
        let dataJSON = JSON.stringify(datainfoObject);
        // Ecriture des logs
        fs.writeFileSync("./logs/logs.json", dataJSON);
    }

    // Récupération du fichier LOGS
    let logsData = fs.readFileSync("./logs/logs.json");
    // Mise en OBJ
    var logobj = JSON.parse(logsData);
    // PUSH TO VARIABLE
    logobj['Logs'].push(logPush);
    // Mise en Strg
    jsonStr = JSON.stringify(logobj);
    // Ecriture des logs
    fs.writeFileSync("./logs/logs.json", jsonStr);
}

function Logs(module, type, message) {
    let date = LogDate();
    switch (type) {
        case "info":
            console.log('[' + date + '][' + module + '][' + type + '] - ' + message)
            break;

        case "succes":
            console.log('[' + date + '][' + module + '][' + type + '] - ' + message)
            break;

        case "warning":
            console.warn('[' + date + '][' + module + '][' + type + '] - ' + message)
            break;

        case "error":
            console.error('[' + date + '][' + module + '][' + type + '] - ' + message)
            break;

        default:
            console.log('[' + date + '][' + module + '][' + type + '] - ' + 'LOGS ERROR')
            break;
    }
    let dataPushLog = {
        "timestamp": date,
        "level": type,
        "loggerName": module,
        "message": message
    }
    LogWriter(dataPushLog);
}


module.exports = { Logs }

// logger.trace('message'); // A voir ...
// logger.debug('message');