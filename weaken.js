/** @param {NS} ns */
/*
  Continuously weaken a server to a certain security level. If no security level is specified, this script
  runs until it reaches the server's minimum security plus 10.
*/
export async function main(ns) {
    const serverName = ns.args[0],
        securityThreshold = ns.args[1] !== undefined ? 
            ns.args[1] === 'min' ? ns.getServerMinSecurityLevel(serverName) : ns.args[1] 
            : ns.getServerMinSecurityLevel(serverName) + 10;
    if ( typeof serverName !== 'string' || typeof securityThreshold !== 'integer' || serverName === 'help' ) {
        ns.tprint("Usage: run weaken.js [-t THREADS] SERVER-NAME [SECURITY-LEVEL]");
        ns.tprint("  The security level parameter value should be a number or the string 'min'.")
        ns.tprint("  If no security level is provided, the server will be weakened to its minimum + 10.")
        return;
    }
    if ( ! ns.serverExists(serverName) ) {
        ns.tprint("Cannot find server "+serverName+"!");
        return;
    }
    ns.print("Weakening server "+serverName+" to security level "+securityThreshold);
    while ( ns.getServerSecurityLevel(serverName) > securityThreshold ) {
        await ns.weaken(serverName)
        await ns.sleep(100);
    }
}