// CONST
const fs = require("fs");
const si = require('systeminformation');

const { WriteLogsOsLast, WriteErrorAgent, WriteLogs } = require("../core/SysCore");
const { Logs } = require("../core/LogCore");
const Mod = 'Module - DISK';

function DISK() {
    si.fsSize()
        .then(data => {
            WriteLogsOsLast(data, 'disk');
            WriteLogs(data, 'disk')
            fs.existsSync('/logs/critical/DISK.json', function () {
                fs.rmSync('/logs/critical/DISK.json');
            })
        })
        .catch(error => {
            WriteErrorAgent('critical', 'DISK', 'La sonde MEM n\'a pas réussi à récupérer les informations. ERR: ' + error)
        })

}

// First Start
DISK();

setInterval(() => {
    DISK();
}, 20000); // Actualisation du module toutes les 20 Secondes