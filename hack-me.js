/** @param {NS} ns **/
/*
  Pared-down script that continuously hacks the server it's running on. 
*/
import {formatNumber} from './library.js';

export async function main(ns) {
  const serverName = ns.getHostname();
  var securityLvl = ns.getServerSecurityLevel(serverName),
    currentMoney = ns.getServerMoneyAvailable(serverName);
  const moneyThreshold = 1000;
  ns.tprint("Money on server '" + serverName + "': " + formatNumber(currentMoney));
  while (currentMoney > moneyThreshold) {
    // Hack!
    await ns.hack(serverName);
    await ns.sleep(250000);
    currentMoney = ns.getServerMoneyAvailable(serverName);
    securityLvl = ns.getServerSecurityLevel(serverName);
  }
}