// CONST
const fs = require("fs");
var osu = require('node-os-utils')

const { WriteLogsOsLast, WriteErrorAgent, WriteLogs } = require("../core/SysCore");
const { Logs } = require("../core/LogCore");
const Mod = 'Module - CPU';

function CPU() {
    var cpu = osu.cpu
    cpu.usage()
        .then(data => {
            WriteLogsOsLast(data, 'cpu');
            WriteLogs(data, 'cpu')
            fs.existsSync('/logs/critical/CPU.json', function () {
                fs.rmSync('/logs/critical/CPU.json');
            })
        })
        .catch(error => {
            WriteErrorAgent('critical', 'CPU', 'La sonde CPU n\'a pas réussi à récupérer les informations. ERR: ' + error)
        })

}

// WriteLogsOsLast(data, 'cpu');
// First Start
CPU();

setInterval(() => {
    CPU();
}, 5000); // Actualisation du module toutes les 5 Secondes