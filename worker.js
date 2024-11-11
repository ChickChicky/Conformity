'use strict';

const { createHash } = require('node:crypto');

const { workerData, parentPort } = require('node:worker_threads');

const { target, chars, info, i, n } = workerData;
const mx = chars.length-1;

const c = [0];
const s = () => c.map(i=>chars[i]).join('');

function ind(k) {
    if (c[k] == mx) {
        c[k] = 0;
        if (k == c.length-1)
            c.push(0);
        else
            ind(k+1);
    }
    else
        c[k]++;
}

for (let k = 0; k < i; ++k)
    ind(0);

for (;;) {
    const v = info.slice(0,-1) + s() + '\n';
    const t = createHash('sha1').update(`commit ${v.length}\0${v}`).digest('hex');
    const nz = /^0*/.exec(t)[0].length;
    if (nz >= target) {
        parentPort.postMessage(`CONFORMS${nz>target?' +'+(nz-target):'\n\x1b[92;1m'}${v.split(/\r?\n/g).slice(5,-1).join('\n')}\x1b[39;22m\nEND\n`);
    }
    for (let k = 0; k < n; ++k)
        ind(0);
}
