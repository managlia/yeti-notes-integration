const chalk = require('chalk');

const S_PAD = '                                                               ';
const S_DEBUG = 'DEBUG ';
// const S_ERROR = 'ERROR ';
// const S_INFO = 'INRO  ';
// const S_TRACE = 'TRACE ';

abcde = (elem, f, l, file) => {
    const locationString = getLocationString(f, l, file);
    const logColor = chalk.green; // getChalkColor(locationString);
    console.log(logColor(`${S_DEBUG}${locationString}${elem}`));
};

errro = (elem, f, l, file) => {
    const locationString = getLocationString(f, l, file);
    const logColor = chalk.red;
    console.log(logColor(`${S_DEBUG}${locationString}${elem}`));
};

getLocationString = (aFunction, aLine, aFile) => {
    let fn = '';
    if (aFile && aFile.indexOf('\\') > -1) {
        const p = aFile.split('\\');
        fn = p[p.length - 2] + '/' + p.pop();
    }
    let formattedString = `[${fn}:${aFunction}(${aLine})]`;
    formattedString = formattedString + S_PAD.slice(formattedString.length);
    return formattedString;
};

// getChalkColor = (fs) => {
//     if (fs.indexOf('integration') > -1) {
//         return chalk.blue;
//     } else if (fs.indexOf('integration') > -1) {
//         return chalk.magenta;
//     } else if (fs.indexOf('service') > -1) {
//         return chalk.green;
//     } else if (fs.indexOf('controller') > -1) {
//         return chalk.yellow;
//     } else if (fs.indexOf('util') > -1) {
//         return chalk.cyan;
//     } else {
//         return chalk.black;
//     }
// };

module.exports = {
    abcde,
    errro
};
