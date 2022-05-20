/** @param {NS} ns **/
/*
  Script to grow the money on a server 10 times, then hack. If the server's 
  security goes 15 above its minimum level, run the weaken.js script.
*/
import {formatNumber} from './library.js';

export async function main(ns) {
  const serverName = ns.args[0];
  var canWeaken = ns.fileExists('weaken.js');
  if ( typeof serverName !== 'string' || serverName === 'help' ) {
    ns.tprint("Usage: run grow-n-hack.js [-t THREADS] SERVER-NAME");
    return;
  } else if ( !ns.serverExists(serverName) ) {
    ns.tprint("There is no server named '"+serverName+"'!");
    return;
  } else if ( !canWeaken ) {
    ns.tprint("This server does not have a copy of weaken.js. Proceeding anyway.");
  }
  const minSecurity = ns.getServerMinSecurityLevel(serverName),
    securityThreshold = minSecurity + 15,
    maxMoney = ns.getServerMaxMoney(serverName),
    moneyThreshold = 500;
  var currentMoney = ns.getServerMoneyAvailable(serverName),
      safetyRelease = false;
  ns.tprint("Money on server '" + serverName + "': " 
    + formatNumber(currentMoney) + " / " + formatNumber(maxMoney));
  while (currentMoney > moneyThreshold) {
    // Increase the amount of money available on the server by running grow() x 10.
    for (var i = 0; i < 10; i++) {
        if ( currentMoney === maxMoney ) break;
        await ns.grow(serverName);
    }
    // If the security gets too high, run weaken.js.
    if ( !safetyRelease && ns.getServerSecurityLevel(serverName) >= securityThreshold ) {
      safetyRelease = true;
      if ( canWeaken && !ns.isRunning('weaken.js', ns.getHostname(), 2, serverName, 'min') ) {
        try {
          ns.run('weaken.js', 2, serverName, 'min');
        } catch {
          ns.print("Can't run weaken.js!");
          canWeaken = false;
        }
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