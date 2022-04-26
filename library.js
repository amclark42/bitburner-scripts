/** @param {NS} ns **/
/*
  General functions to be used in various applications.
*/

/*
 * Format a number for human readability. E.g. 120000000 = 120m
 */
export function formatNumber(number) {
    var useNum = number,
        postFix = '';
    if ( number / 1000000000000 > 1 ) {
        useNum = number / 1000000000000;
        postFix = 't';
    } else if ( number / 1000000000 > 1 ) {
        useNum = number / 1000000000;
        postFix = 'b';
    } else if ( number / 1000000 > 1 ) {
        useNum = number / 1000000;
        postFix = 'm';
    } else if ( number / 1000 > 1 ) {
        useNum = number / 1000;
        postFix = 'k'
    }
    return useNum.toFixed(2) + postFix;
} // END formatNumber()