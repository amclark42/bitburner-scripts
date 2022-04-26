/** @param {NS} ns */
export async function main(ns) {
    const serverName = ns.args[0];
    if ( typeof serverName !== 'string' || serverName === 'help' ) {
        ns.tprint("To use this script, type the name of the server you wish to weaken.");
        return;
    }
    if ( ! ns.serverExists(serverName) ) {
        ns.tprint("Cannot find server "+serverName);
        return;
    }
    const securityThreshold = ns.args[1] || ns.getServerMinSecurityLevel(serverName) + 10;
    var n = 1000;
    while ( n > 0 && ns.getServerSecurityLevel(serverName) > securityThreshold ) {
        await ns.weaken(serverName)
        await ns.sleep(100);
        n--;
        ns.print(n);
    }
}