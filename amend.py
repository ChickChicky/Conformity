from subprocess import check_output, call
#!/usr/bin/env python3
from os import environ

LOC = '.'
MSG = ''''''

cd = check_output(['git', 'log', '-1', '--format=%cd'], text=True, cwd=LOC)
ad = check_output(['git', 'log', '-1', '--format=%ad'], text=True, cwd=LOC)
env = environ.copy()
env['GIT_AUTHOR_DATE'] = ad
env['GIT_COMMITTER_DATE'] = cd
print(call(['git', 'commit', '--amend', '-m', MSG], cwd=LOC, env=env))
