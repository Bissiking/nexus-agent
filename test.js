const si = require('systeminformation');
var osu = require('node-os-utils')


function LogDateNohours() {
  // Date object initialized as per New Zealand timezone. Returns a datetime string
  let annee = new Date().getFullYear(),
      mois  = new Date().getMonth(), 
      jour  = new Date().getDate();

  return annee+''+mois+''+jour;
}


let date = LogDate();

console.log(date);







// // promises style - new since version 3



// // si.system()
// //   .then(data => console.log(data))
// //   .catch(error => console.error(error));

// // console.log('========== OS ==========');

// // si.osInfo()
// //   .then(data => console.log(data))
// //   .catch(error => console.error(error));

// // console.log('========== USERS ==========');
// // Les utilisateurs sont dans des tableaux donc avec un length, je peux récupérer les personnes connecté sur celui-ci.
// // Ensuite, je les push dans un tableau avec les datas nécessaires, puis les envois à Nexus
// // si.users()
// //   .then(data => console.log(data))
// //   .catch(error => console.error(error));

// function MEM() {
//   si.users()
//       .then(data => {
//         console.log(data);
//       })
//       .catch(error => {
//           WriteErrorAgent('critical', 'MEM', 'La sonde MEM n\'a pas réussi à récupérer les informations. ERR: ' + error)
//       })

// }

// // WriteLogsOsLast(data, 'cpu');
// // First Start
// MEM();