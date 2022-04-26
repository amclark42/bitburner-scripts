/** @param {NS} ns */
import {formatNumber} from 'library.js';

export async function main(ns) {
  const serverName = ns.args[0];
  if ( typeof serverName !== 'string' || serverName === 'help' ) {
    ns.tprint("Usage: run what-about.js SERVER-NAME");
    return;
  } else if ( !ns.serverExists(serverName) ) {
    ns.tprint("There is no server named "+serverName+"!");
    return;
  }
  const serverObj = ns.getServer(serverName);
  var moneyNow = formatNumber(serverObj.moneyAvailable),
    moneyMax = formatNumber(serverObj.moneyMax);
  ns.tprint("Information about server '"+serverName+"'");
  ns.tprint("• Money: "+moneyNow+" available out of a "+moneyMax+" maximum");
  ns.tprint("• Server growth: "+serverObj.serverGrowth);
  ns.tprint("• Security level (current): "+serverObj.hackDifficulty);
  ns.tprint("• Security level (minimum): "+serverObj.minDifficulty);
}