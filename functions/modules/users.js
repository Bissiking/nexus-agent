// CONST
const fs = require("fs");
const si = require('systeminformation');

const { WriteLogsOsLast, WriteErrorAgent, WriteLogs } = require("../core/SysCore");
const { Logs } = require("../core/LogCore");
const Mod = 'Module - USERS';

function Users() {
    si.users()
        .then(data => {
            WriteLogsOsLast(data, 'users');
            WriteLogs(data, 'users')
            fs.existsSync('/logs/critical/users.json', function () {
                fs.rmSync('/logs/critical/users.json');
            })
        })
        .catch(error => {
            WriteErrorAgent('critical', 'users', 'La sonde "users" n\'a pas réussi à récupérer les informations. ERR: ' + error)
        })
}

// WriteLogsOsLast(data, 'cpu');
// First Start
Users();

setInterval(() => {
    Users();
}, 5000); // Actualisation du module toutes les 5 Secondes