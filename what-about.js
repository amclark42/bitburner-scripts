/** @param {NS} ns */
/*
  Summarize the state of a given server. Makes use of the server interface.
  
  See https://github.com/danielyxie/bitburner/blob/dev/markdown/bitburner.server.md
*/
import {formatNumber} from './library.js';

export async function main(ns) {
  for (const serverName of ns.args) {
    if ( typeof serverName !== 'string' || serverName === 'help' ) {
      ns.tprint("Usage: run what-about.js SERVER-NAME [SERVER-NAME2 [...]]");
      return;
    } else if ( !ns.serverExists(serverName) ) {
      ns.tprint("There is no server named '"+serverName+"'!");
      break;
    }
    const serverObj = ns.getServer(serverName);
    var moneyNow = formatNumber(serverObj.moneyAvailable),
      moneyMax = formatNumber(serverObj.moneyMax),
      ramAvailable = serverObj.maxRam - serverObj.ramUsed;
    ns.tprint("INFO ON "+serverName.toUpperCase());
    if ( !serverObj.hasAdminRights ) {
      ns.tprint("  • Nukable at Hack level "+serverObj.requiredHackingSkill
        +" when "+serverObj.numOpenPortsRequired+" port(s) are open");
    }
    ns.tprint("  • Money: "+moneyNow+" available out of a "+moneyMax+" maximum");
    ns.tprint("  • Server growth: "+serverObj.serverGrowth);
    ns.tprint("  • Security level (current): "+serverObj.hackDifficulty.toFixed(2));
    ns.tprint("  • Security level (minimum): "+serverObj.minDifficulty);
    ns.tprint("  • RAM: "+ramAvailable.toFixed(2)+"GB available out of "
      +serverObj.maxRam.toFixed(2)+"GB");
  }
}