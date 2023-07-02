// Définission des varaibles
const fs = require("fs");
const { Logs } = require("./functions/core/LogCore");
const { WriteDocs, WriteErrorAgent } = require("./functions/core/SysCore");
const { ForkStart } = require("./functions/core/ForkCore");

const NodeVersion = process.versions.node;

var token = process.env.token;

// Création des dossiers nécessaires a l'agent
WriteDocs("./logs", "./logs/alerte");
WriteDocs("./logs", "./logs/warning");
WriteDocs("./logs", "./logs/critical");

// Vérification de la version de NodeJS
if (NodeVersion <= "18.17.0") {
    Mod = "Noyau [Version]";
    Logs(Mod, 'warning', 'Version de node non recommandé: ' + NodeVersion + 'Risque d\'instabilité');
    Logs(Mod, 'warning', 'Version recommandé: 18.16.0');
    WriteErrorAgent('warning', Mod, 'Version non recommandé: "'+ NodeVersion +'". Les modules peuvent de pas fonctionner /n/r Version recommandé: 18.16.0');
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



// Récupération du Token de connexion à Nexus
if (token == "" || token == undefined) {
    Mod = "Noyau [Token]";
    // Si non disponible, passage de l'agent en mode Offline
    Logs(Mod, 'warning', 'Aucun token disponible');
    Logs(Mod, 'warning', 'Passage en mode Offline');
    token = "offline";
} else {
    Mod = "Noyau [Token]";
    Logs(Mod, 'info', 'Token identifié, tentative de connexion avec Nexus');
    // TENTATIVE DE CONNEXION ......
}

// Création des dossiers nécessaires au monitoring
WriteDocs("./logs", "./logs/monitoring");
WriteDocs("./logs", "./logs/last_monitoring");

// Lancement des modules après 5 secondes

setTimeout(() => {
    
    // Lancement de l'API
    ForkStart('api');

    // Lancement des sondes
    ForkStart('cpu');
    ForkStart('ram');
    ForkStart('disk');

}, 500);