" Override default test runner & debugging functions for this project

function! MyRunAllSpecs()
  write
  Tmux brownie test
endfunction

function! MyRunNearestSpec()
  write
  let linenumber = search('def test', 'bcnW')
  let line = getline(linenumber)
  let funcname = matchstr(line, 'test_\w\+')
  execute "Tmux brownie test -k " . funcname
endfunction

function! MyRunCurrentSpecFile()
  write
  let s:test_cmd = "Tmux brownie test " . @%
  execute s:test_cmd
endfunction

map <Leader>db oimport pdb; pdb.set_trace()<ESC>ddP:w<CR>


