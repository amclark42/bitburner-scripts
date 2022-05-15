/** @param {NS} ns */
/*
  Start afresh after installing augmentations: hack a few servers, buy a few Hacknet 
  nodes.
 */
export async function main(ns) {
  // Start by targeting the servers that are hackable at level 1.
  const currentServer = ns.getHostname();
  var targets = ['n00dles', 'foodnstuff'];
  for (const target of targets) {
    ns.run('do-nuke.js', 1, target);
    if ( ! ns.isRunning('grow-n-hack.js', currentServer, target) ) {
      ns.run('grow-n-hack.js', 2, target);
    }
    ns.run('copy-scripts-to.js', 1, target);
    await ns.sleep(100);
    if ( ! ns.isRunning('hack-me.js', target) ) {
      ns.exec('hack-me.js', target, 2);
    }
  }
  // Purchase a few Hacknet nodes and upgrade them.
  for (var n = 0; n <= 2; n++) {
    const node = ns.hacknet.purchaseNode();
    // If the limit on Hacknet nodes has been reached, or there isn't enough money, 
      // stop looping early.
    if ( node === -1 ) break;
    const lvlCost = ns.hacknet.getLevelUpgradeCost(node, 9);
    if ( ns.getServerMoneyAvailable('home') > lvlCost ) {
        ns.hacknet.upgradeLevel(node, 9);
    }
  }
  // Now start targeting the other low-level servers.
  targets = ['sigma-cosmetics', 'joesguns', 'nectar-net', 'hong-fang-tea', 
    'harakiri-sushi'];
  for (const target of targets) {
    const serverHackLvl = ns.getServerRequiredHackingLevel(target);
    // Keep waiting and checking for my Hack level to reach the target's.
    while ( ns.getHackingLevel() < serverHackLvl ) {
      await ns.sleep(15000);
    }
    ns.run('copy-scripts-to.js', 1, target);
    ns.run('do-nuke.js', 1, target);
    if ( ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target) ) {
      ns.run('weaken.js', 4, target, 'min');
    }
    if ( ! ns.isRunning('grow-n-hack.js', currentServer, target) ) {
      ns.run('grow-n-hack.js', 2, target);
    }
    // Run grow-and-hack.js on the target server with 3 threads, which leaves enough 
      // space for weaken.js to run with 2 threads, later.
    if ( ! ns.isRunning('grow-n-hack.js', target, target) ) {
      ns.exec('grow-n-hack.js', target, 3, target);
    }
  }
}