from subprocess import check_output
from hashlib import sha1

LOC = '.'
CONFORMITY = 6

info = check_output(['git', '--no-replace-objects', 'cat-file', 'commit', 'HEAD'], cwd=LOC)

validChars = ''.join(set('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789()[]{}<>$@#"\'\\+-*/~&!:;?%'))
mx = len(validChars)-1

c = [0]

def s():
    return ''.join(map(lambda i:validChars[i],c))

def ind(i):
    global c
    if c[i] == mx:
        c[i] = 0
        if i == len(c)-1:
            c.append(0)
        else:
            ind(i+1)
    else:
        c[i] += 1

def test():
    v = info[:-1] + bytes(s(),'utf-8') + b'\n'
    sh = sha1()
    sh.update(bytes(f'commit {len(v)}\0', 'ascii')+v)
    return ''.join(map(lambda c:hex(c)[2:].ljust(2,'0'),sh.digest()))

while 1:
    t = test()
    nz = len(t)-len(t.lstrip('0'))
    if nz >= CONFORMITY:
        t = 'CONFORMS'
        if nz > CONFORMITY:
            t += ' +'+str(nz-CONFORMITY)
        print(t)
        print('\x1b[92;1m'+(b'\n'.join(info.splitlines()[4:])).decode('utf-8')+s()+'\x1b[39;22m')
        print('END\n')
    ind(0)
