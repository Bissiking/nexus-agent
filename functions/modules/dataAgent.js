// CONST
const fs = require("fs");
const axios = require('axios');
const ConfigNexus = require('../../data/config.json');
const DataAgent = require('../../data/dataAgent.json');
const version = require('../../version.json');
const { TokenSearch } = require('../core/SysCore');

const { WriteLogsOsLast, WriteErrorAgent, WriteLogs } = require("../core/SysCore");
const { Logs } = require("../core/LogCore");
const Mod = 'Module - Data Agent';

function dataVersion() {
    let token = TokenSearch();
    console.log(token);
    let data = {
        "id_agent": DataAgent.id_agent,
        "token": token,
        "version": version.version
    }
    // Envoie de la version de l'agent à Nexus
    axios.post(ConfigNexus.url + '/agent/update', data, { headers: { 'content-type': 'application/x-www-form-urlencoded' } })
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
            Logs(Mod, 'error', 'Echec de la connexion avec Nexus');
            token = "offline";
        });
}

function up_monitoring(sonde) {
    let token = TokenSearch();
    // Récupération des logs
    fs.readFile('./logs/last_monitoring/' + sonde + '_last.json', "utf8", function (err, data) {
        if (err) {
            Logs(Mod, 'error', 'Echec de la récupération de la sonde: '+err);
        }
        let DataSonde = {
            "token": token,
            "sonde": sonde,
            "data": data
        }

        // Envoie de la version de l'agent à Nexus
        axios.post(ConfigNexus.url + '/agent/upload/monitoring', DataSonde, { headers: { 'content-type': 'application/x-www-form-urlencoded' } })
            .then(function (response) {})
            .catch(function (error) {
                console.log(error);
                Logs(Mod, 'error', 'Echec de la connexion avec Nexus');
                token = "offline";
            });

    })

}


// First Start
dataVersion();

up_monitoring('cpu');
up_monitoring('mem');
up_monitoring('disk');
up_monitoring('users');

// Envoie donnée CPU, RAM, .... toutes les x temps
setInterval(() => {
    up_monitoring('cpu');
    up_monitoring('mem');
}, 17000); // Actualisation du module toutes les 17 secondes

setInterval(() => {
    up_monitoring('disk');
    up_monitoring('users');
}, 60000) // Envoie des données toutes les 1 minutes

setInterval(() => {
    dataVersion();
}, 180000); // Actualisation du module toutes les 30 Minutes