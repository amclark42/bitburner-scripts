/** @param {NS} ns */
/*
  Continuously weaken a server to a certain security level. If no security level is specified, this script
  runs until it reaches the server's minimum security plus 10.
*/
export async function main(ns) {
    const serverName = ns.args[0];
    if ( typeof serverName !== 'string' || serverName === 'help' ) {
        ns.tprint("Usage: run weaken.js [-t THREADS] SERVER-NAME [SECURITY-LEVEL]");
        ns.tprint("  If no security level is provided, the server will be weakened to its minimum + 10.")
        return;
    }
    if ( ! ns.serverExists(serverName) ) {
        ns.tprint("Cannot find server "+serverName);
        return;
    }
    const securityThreshold = ns.args[1] || ns.getServerMinSecurityLevel(serverName) + 10;
    while ( ns.getServerSecurityLevel(serverName) > securityThreshold ) {
        await ns.weaken(serverName)
        await ns.sleep(100);
    }
}