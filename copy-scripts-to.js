/** @param {NS} ns */
/*
  Copy scripts from the current server to another.
*/

export function autocomplete(data, args) {
  return [...data.servers, ...data.scripts];
}

export async function main(ns) {
  const recipientName = ns.args[0],
    defaultFiles = ['library.js', 'weaken.js', 'grow-n-hack.js', 'hack-me.js', 'what-about.js'],
    files = ns.args.slice(1).length > 0 ? ns.args.slice(1) : defaultFiles;
  if (typeof recipientName !== 'string' || recipientName === 'help') {
    ns.tprint("Usage: run copy-scripts-to.js [-t THREADS] SERVER-NAME [SCRIPT1 [SCRIPT2 ...]]");
    ns.tprint("If no scripts are named, these will be copied to the target server:");
    for (const filename of defaultFiles) {
      ns.tprint("  • "+filename);
    }
    return;
  } else if ( !ns.serverExists(recipientName) ) {
    ns.tprint("There is no server named '"+recipientName+"'!");
    return;
  }
  ns.tprint("Copying script(s) to '"+recipientName+"': "+files.join(', '));
  if ( await ns.scp(files, recipientName) ) {
    ns.tprint("Done!");
  } else {
    ns.tprint("ERROR: Something went wrong.");
  }
}