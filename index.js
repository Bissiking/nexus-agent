// Définission des varaibles
const fs = require("fs");
const axios = require('axios');
const { Logs } = require("./functions/core/LogCore");
const { WriteDocs, WriteErrorAgent, WriteAgentData, TokenSearch } = require("./functions/core/SysCore");
const { ForkStart } = require("./functions/core/ForkCore");
const NodeVersion = process.versions.node;

function StartApps(status) {
    // Lancement de l'API
    ForkStart('api');

    // Lancement des sondes
    ForkStart('cpu');
    ForkStart('ram');
    ForkStart('disk');
    ForkStart('users');

    if (status == "online") {
        ForkStart('dataAgent');
    }

}

function Core() {
    const ConfigNexus = require('./data/config.json');
    const { setTimeout } = require("timers");
    let token = TokenSearch();
    // Création des dossiers nécessaires au monitoring
    WriteDocs("./logs", "./logs/monitoring");
    WriteDocs("./logs", "./logs/last_monitoring");

    // Récupération du Token de connexion à Nexus
    if (token == "" || token == undefined) {
        Mod = "Noyau [Token]";
        // Si non disponible, passage de l'agent en mode Offline
        Logs(Mod, 'warning', 'Aucun token disponible');
        Logs(Mod, 'warning', 'Passage en mode Offline');
        setTimeout(() => {
            StartApps("offline");
        }, 2500);

    } else {
        Mod = "Noyau [Token]";
        Logs(Mod, 'info', 'Token identifié, tentative de connexion avec Nexus');
        // TENTATIVE DE CONNEXION ......
        axios.get(ConfigNexus.url + '/agent/init/' + token)
            .then(function (response) {
                console.log('RESPONSE: ' + response.data);
                if (!fs.existsSync('dataAgent.json')) {
                    // Ecriture des data de l'agent
                    WriteAgentData(response.data);
                } else {
                    console.log('skip');
                }
                setTimeout(() => {
                    StartApps("online");
                }, 5000);
            })
            .catch(function (error) {
                Logs(Mod, 'error', 'Echec de la connexion avec Nexus');
            });
    }
}






// Création des dossiers nécessaires a l'agent
WriteDocs("./logs", "./logs/alerte");
WriteDocs("./logs", "./logs/warning");
WriteDocs("./logs", "./logs/critical");

// Vérification de la version de NodeJS
if (NodeVersion < "18.16.0") {
    Mod = "Noyau [Version]";
    Logs(Mod, 'warning', 'Version de node non recommandé: ' + NodeVersion + ' || Risque d\'instabilité');
    Logs(Mod, 'warning', 'Version recommandé: 18.16.0');
    WriteErrorAgent('warning', Mod, 'Version non recommandé: "' + NodeVersion + '". Les modules peuvent de pas fonctionner /n/r Version recommandé: 18.16.0');
}


// Vérification de la présence du dossier Fork
fs.existsSync("./data/fork", (err) => {
    Mod = "Noyau [Fork Docs Check]";
    if (err) {
        // Erreur, blocage de l'allumage de l'agent
        Logs(Mod, 'error', 'Erreur lors de la supression des anciens Fork: ' + err);
        return;
    } else {
        // Reset des dossiers (Supression des anciens Fork)
        fs.rmdir('./data/fork', (err) => {
            if (err) {
                // Echec de la supression des logs
                Logs(Mod, 'warning', 'Erreur lors de la supression des anciens Fork: ' + err);
                WriteErrorAgent('warning', Mod, 'Risque de données des Fork invalide');
            } else {
                Logs(Mod, 'succes', 'Erreur lors de la supression des anciens Fork: ' + err);
            }
        });
    }
});

setTimeout(() => {
    // Vérification de la présence du dossier Fork
    if (!fs.existsSync("./data/config.json")) {
        Mod = "Noyau [Create config]";
        fs.copyFile("./data/config_sample.json", "./data/config.json", (err) => {
            if (err) {
                Logs(Mod, 'error', 'Erreur lors de la copie de la config: ' + err);
            } else {
                Core();
            }
        });
    } else {
        Core();
    };
}, 5000);
