/** @param {NS} ns **/

/*
 * Format a number for human readability. E.g. 120000000 = 120m
 */
export function formatNumber(number) {
    var useNum = number,
        postFix = '';
    if ( number / 1000000000 > 1 ) {
        useNum = number / 1000000000;
        postFix = 'b';
    } else if ( number / 1000000 > 1 ) {
        useNum = number / 1000000;
        postFix = 'm';
    } else if ( number / 1000 > 1 ) {
        useNum = number / 1000;
        postFix = 't'
    }
    return useNum.toFixed(2) + postFix;
}

/*
 * Reduce the server's security level to a given number.
 */
export async function weakenTo(ns, serverName, threshold) {
    var minSecurityThreshold = ns.getServerMinSecurityLevel(serverName);
    if ( !threshold || threshold < minSecurityThreshold ) {
        threshold = minSecurityThreshold;
    }
    while (ns.getServerSecurityLevel(serverName) > threshold) {
        ns.print("Lowering security level.");
        await ns.weaken(serverName);
    }
} // weakenTo()