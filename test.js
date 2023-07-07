const si = require('systeminformation');

// promises style - new since version 3



si.system()
  .then(data => console.log(data))
  .catch(error => console.error(error));

console.log('========== OS ==========');

si.osInfo()
  .then(data => console.log(data))
  .catch(error => console.error(error));

console.log('========== USERS ==========');
si.users()
  .then(data => console.log(data))
  .catch(error => console.error(error));
