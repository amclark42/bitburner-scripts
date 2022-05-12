/** @param {NS} ns **/
// Do I have root access? If not, can I get it?
export function canNuke(ns, serverName) {
  const serverObj = ns.getServer(serverName);
  return !serverObj.hasAdminRights 
    && serverObj.openPortCount >= serverObj.numOpenPortsRequired;
}

export async function main(ns) {
  for (const serverName of ns.args) {
    if ( ns.hasRootAccess(serverName) ) {
      ns.tprint("Already NUKEd '"+serverName+"'");
    }
    // If it looks like the server is NUKEable, do it!
    else if ( canNuke(ns, serverName) ) {
      ns.nuke(serverName);
      var message = ns.hasRootAccess(serverName) 
        ? "Successful NUKE" : "Failed to NUKE";
      ns.tprint(message);
    // A number of ports need to be opened before NUKE can be used.
    } else {
      var serverObj = ns.getServer(serverName),
        totalPortsNeeded = serverObj.numOpenPortsRequired,
        openPorts = [
          {
            'port': 'ssh',
            'program': 'BruteSSH.exe',
            'function': ns.brutessh
          }, {
            'port': 'ftp',
            'program': 'FTPCrack.exe',
            'function': ns.ftpcrack
          }, {
            'port': 'smtp',
            'program': 'relaySMTP.exe',
            'function': ns.relaysmtp
          }, {
            'port': 'http',
            'program': 'HTTPWorm.exe',
            'function': ns.httpworm
          }, {
            'port': 'sql',
            'program': 'SQLInject.exe',
            'function': ns.sqlinject
          }
        ];
      // Try to open ports.
      ns.tprint(totalPortsNeeded+" port(s) must be open to NUKE '"+serverName+"'.");
      var p = 0;
      while ( p < totalPortsNeeded && p < openPorts.length ) {
        var portInfo = openPorts[p],
          programExists = ns.fileExists(portInfo.program, 'home');
        // Is this port open?
        if ( !serverObj[portInfo.port+'PortOpen'] && programExists ) {
          ns.tprint("Opening port "+portInfo.port);
          portInfo.function(serverName);
        } else if ( !programExists ) {
          ns.tprint("Create program "+portInfo.program+" to open port "+portInfo.port);
        } else {
          ns.tprint("Port "+portInfo.port+" is already open")
        }
        p++;
      }
      if ( ns.getServer(serverName).openPortCount >= totalPortsNeeded ) {
        ns.nuke(serverName);
        if ( ns.hasRootAccess(serverName) ) {
          ns.tprint("Successful NUKE");
        } else {
          ns.tprint("Could not NUKE! Do you have a high enough hack skill?");
        }
      }
    }
  }
}