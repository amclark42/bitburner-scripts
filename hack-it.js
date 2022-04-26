/** @param {NS} ns **/
/*
  Script to continuously hack a server. If the server's security goes 15 
  above its minimum level, run the weaken.js script.
*/
export async function main(ns) {
  const serverName = ns.args[0],
    canWeaken = ns.fileExists('weaken.js');
  var securityLvl = ns.getServerSecurityLevel(serverName);
  if ( !typeof serverName === 'string' || serverName === 'help' ) {
    ns.tprint("Usage: run hack-it.js [-t THREADS] SERVER-NAME");
    return;
  } else if ( !ns.serverExists(serverName) ) {
    ns.tprint("There is no server named '"+serverName+"'!");
    return;
  } else if ( !canWeaken ) {
    ns.tprint("Server '"+ ns.getHostname()
      +"' does not have a copy of weaken.js. Proceeding anyway.");
  }
  const minSecurity = ns.getServerMinSecurityLevel(serverName), 
    securityThreshold = minSecurity + 15,
    maxMoney = ns.getServerMaxMoney(serverName),
    moneyThreshold = 1000;
  var currentMoney = ns.getServerMoneyAvailable(serverName),
      safetyRelease = false;
  ns.tprint("Money on server " + serverName + ": " + currentMoney + " / " + maxMoney);
  while (currentMoney > moneyThreshold) {
    // Hack!
    await ns.hack(serverName);
    securityLvl = ns.getServerSecurityLevel(serverName);
    // Turn off the safety release if the security level is back under threshold.
    if ( safetyRelease && securityLvl <= securityThreshold ) {
      safetyRelease = false;
    } else if ( securityLvl >= securityThreshold + 1 ) {
      safetyRelease = true;
      if ( canWeaken && !ns.isRunning('weaken.js', 2, serverName, securityThreshold) ) {
        ns.run('weaken.js', 2, serverName, securityThreshold);
      }
      break;
    }
    currentMoney = ns.getServerMoneyAvailable(serverName);
    await ns.sleep(250000);
  }
}