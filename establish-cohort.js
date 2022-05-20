/** @param {NS} ns */
/*
  Given a list of server names, NUKE them, weaken them, and (if the server has RAM 
  to spare) run weaken.js on them.
*/

export function autocomplete(data, args) {
  return [...data.servers];
}

export async function main(ns) {
  const weakenMemReq = 2.05,
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
    let usedRAM = serverObj.ramUsed;
    if ( !ns.isRunning('weaken.js', 'home', serverName, 'min') ) {
      ns.exec('weaken.js', 'home', homeWeakenThreads, serverName, 'min');
    }
    if ( serverObj.maxRam > 0 ) {
      ns.exec('copy-scripts-to.js', 'home', 1, serverName);
      await ns.sleep(100);
      if ( !ns.isRunning('weaken.js', serverName, serverName, 'min') ) {
        const weakenThreads = serverObj.maxRam - usedRAM > weakenMemReq * 4 
          ? 4 : 2;
        ns.exec('weaken.js', serverName, weakenThreads, serverName, 'min');
        usedRAM = usedRAM + ( weakenMemReq * weakenThreads );
        ns.tprint("RAM left on '"+serverName+"' after running weaken.js with "
          +weakenThreads+" threads: "+(serverObj.maxRam - usedRAM));
      }
    }
  }
  ns.tprint('Cohort members: "'+cohortMembers.join(" ")+'"');
}