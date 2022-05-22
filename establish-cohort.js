/** @param {NS} ns */
/*
  Given a list of server names, NUKE them, weaken them, and (if the server has RAM 
  to spare) run weaken.js on them.
*/

export async function main(ns) {
  const memReqWeaken = ns.getScriptRam('weaken.js'),
    memReqGrowNHack = ns.getScriptRam('grow-n-hack.js'),
    homeWeakenThreads = 10;
  let cohortMembers = [];
  for (const serverName of ns.args) {
    if ( typeof serverName !== 'string' || serverName === 'help' ) {
      ns.tprint("Usage: run establish-cohort.js SERVER-NAME [SERVER-NAME2 [...]]");
      return;
    } else if ( !ns.serverExists(serverName) ) {
      ns.tprint("There is no server named '"+serverName+"'!");
      break;
    }
    cohortMembers.push(serverName);
    // Nuke the server.
    if ( !ns.hasRootAccess(serverName) ) {
       ns.exec('do-nuke.js', 'home', 1, serverName);
       await ns.sleep(100);
    }
    // Start weakening the server.
    const serverObj = ns.getServer(serverName);
    let procId,
      usedRAM = serverObj.ramUsed;
    // Run scripts on home.
    if ( !ns.isRunning('weaken.js', 'home', serverName, 'min') ) {
      ns.exec('weaken.js', 'home', homeWeakenThreads, serverName, 'min');
    }
    // If the target server has RAM to spare, run scripts on it.
    if ( serverObj.maxRam > 0 ) {
      ns.exec('copy-scripts-to.js', 'home', 1, serverName);
      await ns.sleep(100);
      // Have the target server weaken, grow, and hack itself.
      if ( !ns.isRunning('weaken.js', serverName, serverName, 'min') ) {
        const weakenThreads = serverObj.maxRam - usedRAM > memReqWeaken * 4 
          ? 4 : 2;
        procId = ns.exec('weaken.js', serverName, weakenThreads, serverName, 'min');
        usedRAM = procId > 0 ? usedRAM + ( memReqWeaken * weakenThreads ) : usedRAM;
      }
      if ( !ns.isRunning('grow-n-hack.js', serverName, serverName) ) {
        procId = ns.exec('grow-n-hack.js', serverName, 2, serverName);
        usedRAM = procId > 0 ? usedRAM + (memReqGrowNHack * 2) : usedRAM;
      }
      // TODO Have the server start weakening its cohorts.
      ns.tprint("RAM left on '"+serverName+"': "+(serverObj.maxRam - usedRAM));
    }
  }
  ns.tprint('Cohort members: "'+cohortMembers.join(" ")+'"');
}