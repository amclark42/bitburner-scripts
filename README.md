# Bitburner scripts

My scripts for the incremental game [Bitburner](https://github.com/danielyxie/bitburner). Feel free to use however you like.

I use [ns2 Netscript](https://bitburner.readthedocs.io/en/latest/netscript/netscriptjs.html). So far I’ve stuck to the standard functions that are available from the very beginning of the game, but that may change as the scripts continue to evolve.


## What’s here?

In general, this repository contains a note, a Netscript library, a number of scripts.

### The note

[`gone-to.txt`](./notes/gone-to.txt) contains advice for starting fresh after installing augmentations.


### The library

[`library.js`](./library.js) is a place for me to put functions for commonly-used tasks. In the past I didn’t bother copying it to other servers, so it currently only has one function:

* `formatNumber()`, which makes a large number human-readable by reducing it to something like `###.##`, with a postfix. For example, `6875000000` would become `6.88b`.

To import a function into a script, begin the latter with:

```js
import {formatNumber} from './library.js';
```


### The scripts

All of these scripts will describe their expected usages when `help` is used as the first argument. (*One exception: `hack-me.js` does not have help text.*)

* [`what-about.js`](./what-about.js): Lists information about 1 or more servers, including NUKE-ability, money capacity, server growth, security level, and RAM usage.
* [`do-nuke.js`](./do-nuke.js): NUKEs 1 or more servers, after first opening the necessary ports.
* [`weaken.js`](./weaken.js): Continuously weakens a server’s security level. By default, it stops at the server’s minimum security level + 10, but you can specify otherwise.
* [`grow-n-hack.js`](./grow-n-hack.js): Grows the amount of money on a server a maximum of 10 times before hacking. The grow loop cuts out early if the server reaches its maximum amount of money. If `weaken.js` is available, this script will try to run it if the security level gets 15 above the minimum.
* [`hack-it.js`](./hack-it.js): Continuously hacks a server in 250,000 ms (a little over 4 min) intervals. If `weaken.js` is available, this script will try to run it if the security level gets 15 above the minimum.
* [`hack-me.js`](./hack-me.js): Continuously hacks the server this script is running on, in 250,000 ms intervals. This is an extremely pared-down script that does not test the server’s security levels. As a result, it can be run on n00dles with 2 threads, for 3.90GB RAM.
* [`copy-scripts-to.js`](./copy-scripts-to.js): Copies 1 or more scripts from the current server to another. Useful since Bitburner’s `scp` terminal command doesn’t move multiple files at once. If no filenames are given in the program arguments, the scripts I use most often are copied over.
* [`start-again.js`](./start-again.js): Begin hacking low-level servers and buying Hacknet nodes. Intended to be run after installing augmentations.
* [`get-path-to.js`](./get-path-to.js): Finds a quick route from the current server to a given destination, taking backdoors into account.
* [`establish-cohort.js`](./establish-cohort.js): NUKEs, weakens, and starts running scripts on a group of servers.


## My aliases

```
alias what-about="run what-about.js"
alias path-to="run get-path-to.js"
alias establish="run establish-cohort.js"
alias -g first-cohort="n00dles joesguns nectar-net hong-fang-tea harakiri-sushi"
alias -g second-cohort="silver-helix the-hub netlink summit-uni catalyst computek rothman-uni"
alias -g third-cohort="lexo-corp syscore global-pharm alpha-ent unitalife nova-med univ-energy"
alias -g fourth-cohort="omnia galactic-cyber taiyang-digital zeus-med zb-institute icarus solaris"
alias -g fifth-cohort="microdyne vitalife 4sigma applied-energetics aerocorp"
```
