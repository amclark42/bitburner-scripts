/** @param {NS} ns **/
/*
  Pared-down script that continuously hacks the server it's running on. 
*/
export async function main(ns) {
  const serverName = ns.getHostname();
  var securityLvl = ns.getServerSecurityLevel(serverName),
    currentMoney = ns.getServerMoneyAvailable(serverName);
  const moneyThreshold = 1000;
  ns.tprint("Money on server " + serverName + ": " + currentMoney);
  while (currentMoney > moneyThreshold && securityLvl < 40) {
    // Hack!
    await ns.hack(serverName);
    await ns.sleep(250000);
    currentMoney = ns.getServerMoneyAvailable(serverName);
    securityLvl = ns.getServerSecurityLevel(serverName);
  }
}