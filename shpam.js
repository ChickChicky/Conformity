'use strict';
const { execFileSync } = require('node:child_process');
const { Worker} = require('node:worker_threads');

const LOC = '.';
const CONFORMITY = 6;
const N = 4;

const info = execFileSync('git', ['--no-replace-objects', 'cat-file', 'commit', 'HEAD'], {cwd:LOC}).toString('utf-8');

const validChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789()[]{}<>$@#"\'\\+-*|/~&.:;!?%_`^=';

const workers = [];
for (let i = 0; i < N; ++i) {
    const worker = new Worker('./worker.js', {workerData:{i,n:N,info,chars:validChars,target:CONFORMITY}});
    worker.on('message',console.log);
    workers.push(worker);
}
