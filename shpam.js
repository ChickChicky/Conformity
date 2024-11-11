const cp = require('node:child_process');
const { createHash } = require('node:crypto');

const LOC = '.';
const CONFORMITY = 6;

const info = cp.execFileSync('git', ['--no-replace-objects', 'cat-file', 'commit', 'HEAD'], {cwd:LOC}).toString('utf-8');

const validChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789()[]{}<>$@#"\'\\+-*/~&!:;?%';
const mx = validChars.length-1;

const c = [0];

const s = () => c.map(i=>validChars[i]).join('');

function ind(i) {
    if (c[i] == mx) {
        c[i] = 0;
        if (i == c.length-1)
            c.push(0);
        else
            ind(i+1);
    }
    else
        c[i]++;
}

function test() {
    const v = info.slice(0,-1) + s() + '\n';
    return createHash('sha1').update(`commit ${v.length}\0${v}`).digest('hex');
}

for (;;) {
    const t = test();
    nz = /^0*/.exec(t)[0].length;
    if (nz >= CONFORMITY) {
        console.log(`CONFORMS${nz>CONFORMITY?' +'+(nz-CONFORMITY):'\n\x1b[92;1m'}${info.split(/\r?\n/g).slice(5,-1).join('\n')+s()}\x1b[39;22m\nEND\n`);
    }
    ind(0);
}
