// CONST
const fs = require("fs");
var osu = require('node-os-utils')

const { WriteLogsOsLast, WriteErrorAgent, WriteLogs } = require("../core/SysCore");
const { Logs } = require("../core/LogCore");
const Mod = 'Module - RAM';

function MEM() {
    var mem = osu.mem
    mem.info()
        .then(data => {
            WriteLogsOsLast(data, 'mem');
            WriteLogs(data, 'mem')
            fs.existsSync('/logs/critical/MEM.json', function () {
                fs.rmSync('/logs/critical/MEM.json');
            })
        })
        .catch(error => {
            WriteErrorAgent('critical', 'MEM', 'La sonde MEM n\'a pas réussi à récupérer les informations. ERR: ' + error)
        })

}

// WriteLogsOsLast(data, 'cpu');
// First Start
MEM();

setInterval(() => {
    MEM();
}, 5000); // Actualisation du module toutes les 5 Secondes