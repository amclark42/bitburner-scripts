/** @param {NS} ns **/
/*
  Script to grow the money on a server 10 times, then hack. If the server's 
  security goes 15 above its minimum level, run the weaken.js script.
*/
export async function main(ns) {
  const serverName = ns.args[0],
    canWeaken = ns.fileExists('weaken.js');
  if ( typeof serverName !== 'string' || serverName === 'help' ) {
    ns.tprint("Usage: run grow-n-hack.js [-t THREADS] SERVER-NAME");
    return;
  } else if ( !ns.serverExists(serverName) ) {
    ns.tprint("There is no server named "+serverName+"!");
    return;
  } else if ( !canWeaken ) {
    ns.tprint("This server does not have a copy of weaken.js. Proceeding anyway.");
  }
  const minSecurity = ns.getServerMinSecurityLevel(serverName),
    origSecurity = ns.getServerSecurityLevel(serverName),
    securityThreshold = minSecurity + 15,
    maxMoney = ns.getServerMaxMoney(serverName),
    moneyThreshold = 1000;
  var currentMoney = ns.getServerMoneyAvailable(serverName),
      safetyRelease = false;
  ns.tprint("Money on server " + serverName + ": " + currentMoney + " / " + maxMoney);
  while (currentMoney > moneyThreshold) {
    // Increase the amount of money available on the server by running grow() x 10.
    for (var i = 0; i < 10; i++) {
        await ns.grow(serverName);
        if ( ns.getServerMoneyAvailable(serverName) === maxMoney ) break;
    }
    // If the security gets too high, run weaken.js.
    if ( !safetyRelease && ns.getServerSecurityLevel(serverName) >= securityThreshold ) {
      safetyRelease = true;
      if ( canWeaken && !ns.isRunning('weaken.js', ns.getHostname(0), 2, serverName, minSecurity) ) {
        ns.run('weaken.js', 2, serverName, minSecurity);
      }
    }
    await ns.sleep(1000);
    // Turn off the safety release if the security level is back under threshold.
    if ( safetyRelease && ns.getServerSecurityLevel(serverName) <= securityThreshold ) {
      safetyRelease = false;
    }
    // Hack!
    if ( !safetyRelease ) {
      await ns.hack(serverName);
    }
    currentMoney = ns.getServerMoneyAvailable(serverName);
  }
}