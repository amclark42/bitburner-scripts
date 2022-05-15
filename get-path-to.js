/** @param {NS} ns */
/*
  Find a quick route between the current server and another. Backdoors are taken 
  into account.
*/
export function surveyConnections(ns, serverName, destination, route, previousServer) {
  let connections = ns.scan(serverName);
  // Stop iterating once the destination has been reached.
  if ( connections.includes(destination) ) {
    route.unshift(destination);
    return true;
  }
  for (const namedConnection of connections) {
    // Skip the server that's already been processed.
    if ( previousServer !== undefined && namedConnection === previousServer ) {
      continue;
    }
    // Check this named connection for a path to the destination.
    if ( surveyConnections(ns, namedConnection, destination, route, serverName) ) {
      route.unshift(namedConnection);
      // If this connection has a backdoor, there's no need to list previous servers 
        // along the route.
      return !ns.getServer(namedConnection).backdoorInstalled;
    }
  }
  return false;
} // END surveyConnections()

export async function main(ns) {
  const startServer = ns.getHostname(),
    destination = ns.args[0];
  let path = [];
  if ( typeof destination !== 'string' || destination === 'help' ) {
    ns.tprint("Usage: run get-path-to.js [-t THREADS] SERVER-NAME");
    return;
  }
  if ( !ns.serverExists(destination) ) {
    ns.tprint("Cannot find server '"+destination+"'!");
    return;
  }
  ns.tprint("Mapping the path from '"+startServer+"' to '"+destination+"':");
  // If the destination server has a backdoor installed, only one step is necessary.
  if ( ns.getServer(destination).backdoorInstalled ) {
    path.push(destination);
  } else {
    surveyConnections(ns, startServer, destination, path);
  }
  // List out directions to the destination server.
  for (let i = 0; i < path.length; i++) {
    const step = path[i];
    ns.tprint("  "+ (i+1) + ". "+step);
  }
}