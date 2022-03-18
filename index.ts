// const { fork } = require('child_process');
// const lsReturnData = fork(__dirname + '/childProcess.js');

// lsReturnData.on('message', (m) => {
//     console.log('message received');
//     console.log(m);
// })

// setTimeout(() => { console.log('child ended'), 4999})


import { SerialPort } from 'serialport'
import { SlipEncoder, SlipDecoder } from '@serialport/parser-slip-encoder'
import { ReadlineParser } from '@serialport/parser-readline'
import { InputRegistry } from './device.js'

import { Msg, strfy } from './lib/utils.js'
const msg = Msg('MakeShiftSerial');

let inputBuffer:number[] = [];
let dataTimer:NodeJS.Timer;
const slipEncoder = new SlipEncoder({
    ESC: 219,
    END: 192,
    ESC_END: 220,
    ESC_ESC: 221,
});
const slipDecoder = new SlipDecoder({
    ESC: 219,
    END: 192,
    ESC_END: 220,
    ESC_ESC: 221,
});

getPort().then((port) => {
    msg('port connection established')
    slipEncoder.pipe(port); // node -> teensy
    slipEncoder.pipe(process.stdout); // node -> console

    port.pipe(slipDecoder); // teensy -> decoder
    slipDecoder.on('data', (data:Buffer) => {
        msg(data);
    }); // decoder -> console


})

export async function getPort() {
    try {
        const portList = await SerialPort.list();

        // console.dir(portList);

        let makeShiftPortInfo = portList.filter((portInfo) => {
            return (portInfo.vendorId === '16c0'
                && portInfo.productId === '0483');
        });

        msg(`Found ports: ${strfy(makeShiftPortInfo)}`)

        const makeShiftPort = new SerialPort({
            path: makeShiftPortInfo[0].path,
            baudRate: 9600
        });
        return makeShiftPort;
    } catch (e) {
        msg(e);
    }
}

// port.write('main screen turn on', function (err) {
//     if (err) {
//         return console.log('Error on write: ', err.message)
//     }
//     console.log('message written')
// })


// port.on('error', function (err) {
//     console.log('Error: ', err.message)
// })


// // upon receiving start transmission ('START' from arduino), do SOMETHING, wait for all data to be
// // received, THEN log data

// //

// // variable scope: var, x is defined outside of function

// const inputBuffer = []
// const inputHistory = []

// port.on('data', function (data) {
//     inputBuffer.push(...data)
//     console.log(JSON.stringify(inputBuffer, '', 2))

//     var bs = String.fromCharCode(...b);
//     if (bs === 'START') {
//         console.log(bs);
//         inputBuffer = inputBuffer.slice(5);
//     } else if (bs === 'END') {
//         let as = inputBuffer.slice(0,-3);
//         as = String.fromCharCode(as);

//         console.log(String.fromCharCode(...as))
//         console.log('END');
//         inputBuffer = []
//     }
// })

// //CLEAR a/BUFFER***
// //if statement not detecting END

// setInterval(() => {
//     port.write('Hi Mom!')
// },
//     5000
// )