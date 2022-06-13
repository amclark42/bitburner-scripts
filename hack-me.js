/** @param {NS} ns **/
/*
  Pared-down script that continuously hacks the server it's running on. 
*/
import {formatNumber} from './library.js';

export async function main(ns) {
  const serverName = ns.getHostname(),
    moneyThreshold = 1000,
    hackInterval = ns.args[0] || 250000;
  if ( hackInterval === 'help' || !typeof hackInterval === 'number' ) {
    ns.tprint("Usage: run hack-me.js [-t THREADS] [INTERVAL-IN-MS]");
    return;
  }
  var currentMoney = ns.getServerMoneyAvailable(serverName);
  ns.tprint("Money on server '" + serverName + "': " + formatNumber(currentMoney));
  while (currentMoney > moneyThreshold) {
    // Hack!
    await ns.hack(serverName);
    await ns.sleep(hackInterval);
    currentMoney = ns.getServerMoneyAvailable(serverName);
  }
}