// CONST
const { fork } = require("child_process");
const fs = require("fs");
const { WriteDocs } = require("./SysCore");
const { Logs } = require("./LogCore");
const Mod = 'ForkCore';

// Status des modules
// 0 -> Non démarré
// 1 -> Redémarrage
// 10 -> Démarré

// Function
function WriteChildData(apps, idChild, statut, AutoReboot) {
    // Remplissage des informations dans le fichier JSON
    var dataFork = {
            "id": apps,
            "node_number": idChild,
            "statut": statut,
            "AutoReboot": AutoReboot,
            "date_statut": new Date(),
        }
        // Conversion
    const forkinfoJSON = JSON.stringify(dataFork);
    const forkinfoObject = JSON.parse(forkinfoJSON);
    // Converting js object into JSON string
    // and writting to data.json file
    const dataJSON = JSON.stringify(forkinfoObject);
    // Ecriture du fichier
    WriteDocs("./data", "./data/fork");
    fs.writeFileSync("./data/fork/" + apps + "_child.json", dataJSON);
}

function ChildOn(child, apps, idChild) {
    child.on('spawn', function() {
        // Indication que le module est allumé dans la console
        WriteChildData(apps, idChild, 10);
        Logs(Mod, 'info', 'Lancement du module: "' + apps + '"');
    });
}

function ChildStop(child, apps, idChild) {
    child.on("close", function(code) {
        Logs(Mod, 'info', 'Arrêt du module: "' + apps + '" || Code: ' + code);
        WriteChildData(apps, idChild, 0);
        // fs.readFileSync('')

    });
}

function ForkReboot(apps) {
    // Passage du module en mode redémarrage
    WriteChildData(apps, idChild, 1);
    // Checkup du nombre de test effectué
    setTimeout(function() {
        ForkStart(apps);
    }, 15000);
}

function ForkStart(apps) {
    // Création de la variable child
    const child = fork('./functions/modules/' + apps + '.js');
    // UPDATE OR CREATE JSON
    let idChild = child.pid
    ChildOn(child, apps, idChild);
    // En cas de fermeture du NODE ---
    ChildStop(child, apps, idChild);
}

function ForkCore(apps) {
    // Création de la variable child
    const child = fork('./core/Core.js');
    // UPDATE OR CREATE JSON
    let idChild = child.pid
    ChildOn(child, "info", apps, idChild, true);
    // En cas de fermeture du NODE ---
    ChildStop(child, "info", apps, idChild);
}

module.exports = { ForkStart, ForkCore, WriteChildData }