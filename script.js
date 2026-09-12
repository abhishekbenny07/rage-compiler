const code = document.querySelector('#code');
const lines = document.querySelector('#lineNumbers');
const output = document.querySelector('#output');
const memeText = document.querySelector('#memeText');
const memeLabel = document.querySelector('#memeLabel');
const memeCard = document.querySelector('#memeCard');
const statusLight = document.querySelector('#statusLight');
const cursorLine = document.querySelector('#cursorLine');
const cursorCol = document.querySelector('#cursorCol');
const mode = document.querySelector('#mode');
const runButton = document.querySelector('#runButton');
const exampleSelect = document.querySelector('#exampleSelect');

const successRoasts = [
  'Your code ran successfully. Unfortunately, so did your confidence.',
  'No errors found. The compiler is confused but respectful.',
  'Program completed. You may now pretend this was planned.',
  'It works. Please do not touch anything.',
  'Your code survived. A historic achievement for everyone involved.',
  'Compilation complete. The bugs are temporarily hiding.',
  'This compiled. Please remain calm; it may never happen again.',
  'C accepted your code. Your future employer is still evaluating it.',
  'The compiler passed it. The code review will be less forgiving.',
  'Zero errors. This is either talent or an elaborate accident.',
  'Your program is valid enough to disappoint someone professionally.'
];
const errorRoasts = [
  'Your code has chosen a different career path.',
  'Even the semicolon is disappointed.',
  'Error detected. Try turning your logic off and on again.',
  'The compiler read that and asked for a moment alone.',
  'This error has more plot twists than a movie trailer.',
  'The code is not broken. It is expressing itself aggressively.',
  'Somewhere, a bracket is wondering why you abandoned it.',
  'The compiler found your bug before you found the Run button.',
  'This line has been promoted to the position of problem.',
  'Your program took one look at reality and declined.',
  'That syntax is creative. Unfortunately, C does not enjoy creativity.',
  'The error is not a feature, no matter how confidently you explain it.',
  'Your code compiled emotionally, but not technically.',
  'This would work perfectly in an alternate universe with fewer rules.',
  'The compiler has submitted a formal complaint about this line.',
  'Your semicolon is on vacation. Please respect its privacy.',
  'Error 100: confidence exceeds code quality.',
  'The bug has unionized and is demanding better variable names.',
  'Congratulations: you found a new way to confuse a computer.',
  'C is not angry. C is just disappointed, loudly.',
  'This program is now eligible for a dramatic rescue montage.',
  'Your logic made a bold exit and forgot to leave a return value.'
];

function random(items) { return items[Math.floor(Math.random() * items.length)]; }
function updateLines() { lines.textContent = Array.from({ length: code.value.split('\n').length }, (_, i) => i + 1).join('\n'); }
function updateCursor() { const before = code.value.slice(0, code.selectionStart); cursorLine.textContent = before.split('\n').length; cursorCol.textContent = before.length - before.lastIndexOf('\n'); }
function setMeme(type, text, label = 'COMPILER STATUS') { memeCard.className = `meme-card ${type}`; memeText.textContent = text; memeLabel.textContent = label; }

code.addEventListener('input', () => { updateLines(); updateCursor(); });
code.addEventListener('click', updateCursor); code.addEventListener('keyup', updateCursor);
code.addEventListener('scroll', () => { lines.scrollTop = code.scrollTop; });
code.addEventListener('keydown', event => { if (event.key === 'Tab') { event.preventDefault(); const start = code.selectionStart; code.setRangeText('  ', start, code.selectionEnd, 'end'); updateLines(); } if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') runCode(); });

function compileC(source) {
  const sourceLines = source.split('\n');
  const lineOf = phrase => Math.max(1, sourceLines.findIndex(line => line.includes(phrase)) + 1);
  if (!/#\s*include\s*[<"]stdio\.h[>"]/.test(source)) {
    throw new Error(`main.c:${lineOf('int main')}: error: add #include <stdio.h> to use printf`);
  }
  if (!/int\s+main\s*\([^)]*\)\s*\{/.test(source)) {
    throw new Error("main.c: error: expected 'int main() { ... }'");
  }
  const openingBraces = (source.match(/\{/g) || []).length;
  const closingBraces = (source.match(/\}/g) || []).length;
  if (openingBraces !== closingBraces) {
    throw new Error(`main.c:${sourceLines.length}: error: expected '}' at end of input`);
  }
  const printedLines = [];
  const printfPattern = /printf\s*\(\s*"((?:\\.|[^"\\])*)"(?:\s*,[^;]*)?\s*\)\s*;/g;
  let match;
  while ((match = printfPattern.exec(source))) {
    printedLines.push(match[1].replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"'));
  }
  if (/printf\s*\(/.test(source) && printedLines.length === 0) {
    throw new Error(`main.c:${lineOf('printf')}: error: expected ';' after printf statement`);
  }
  return printedLines.join('') || 'Program finished.';
}

function runCode() {
  output.hidden = true; statusLight.textContent = '● Judging your code...'; statusLight.style.color = '#f4df40'; runButton.disabled = true;
  setTimeout(() => {
    try {
      compileC(code.value);
      output.hidden = true;
      setMeme('success', random(successRoasts), 'PROGRAM COMPLETED'); statusLight.textContent = '● Program completed'; statusLight.style.color = '#6ee7a6';
    } catch (error) {
      output.textContent = `COMPILATION ERROR\n${error.message}\n\nFix the code above, then press Run Code again.`;
      output.hidden = false;
      setMeme('error', random(errorRoasts), 'COMPILATION ERROR'); statusLight.textContent = '● Error found'; statusLight.style.color = '#ff698d';
    }
    runButton.disabled = false;
  }, 650);
}
runButton.addEventListener('click', runCode);
document.querySelector('#closeTab').addEventListener('click', () => { output.textContent = 'Nice try. main.c is emotionally attached to this editor.'; setMeme('neutral', 'Tab closure request rejected: attachment issues detected.'); });
document.querySelector('.titlebar').addEventListener('dblclick', () => { const modes = ['medium', 'spicy', 'emotionally devastating']; mode.textContent = modes[(modes.indexOf(mode.textContent) + 1) % modes.length]; });
const examples = {
  hello: `#include <stdio.h>\n\nint main() {\n  printf("Hello, hackathon hero!\\n");\n  return 0;\n}`,
  loop: `#include <stdio.h>\n\nint main() {\n  for (int i = 1; i <= 5; i++) {\n    printf("Loop number: %d\\n", i);\n  }\n  return 0;\n}`,
  calculator: `#include <stdio.h>\n\nint main() {\n  int first = 20;\n  int second = 22;\n  int answer = first + second;\n  printf("Answer: %d\\n", answer);\n  return 0;\n}`,
  condition: `#include <stdio.h>\n\nint main() {\n  int sleep = 2;\n  if (sleep < 8) {\n    printf("Hackathon mode activated.\\n");\n  } else {\n    printf("Suspiciously well rested.\\n");\n  }\n  return 0;\n}`,
  error: `#include <stdio.h>\n\nint main() {\n  printf("I forgot my semicolon!\\n")\n  return 0;\n}`
};
exampleSelect.addEventListener('change', () => { code.value = examples[exampleSelect.value]; updateLines(); updateCursor(); output.hidden = true; setMeme('neutral', 'New C example loaded. The compiler is ready to form an opinion.'); });
document.querySelectorAll('.activity-bar button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.activity-bar button').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const action = button.dataset.action;
    statusLight.textContent = `● ${action} opened`;
    statusLight.style.color = '#5de0e6';
    setMeme('neutral', `${action} opened. It is currently as useful as this compiler.`);
  });
});
document.querySelectorAll('.file').forEach(file => {
  file.addEventListener('click', () => {
    document.querySelectorAll('.file').forEach(item => item.classList.remove('active-file'));
    file.classList.add('active-file');
    const fileName = file.dataset.file;
    statusLight.textContent = `● Selected ${fileName}`;
    statusLight.style.color = '#5de0e6';
    setMeme('neutral', fileName === 'main.c' ? 'main.c selected. The code is ready to be judged.' : `${fileName} selected. This file is decorative for the demo.`);
  });
});
document.querySelectorAll('.terminal-tabs button').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.terminal-tabs button').forEach(item => item.classList.remove('selected'));
    tab.classList.add('selected');
    statusLight.textContent = `● ${tab.textContent} selected`;
    statusLight.style.color = '#5de0e6';
    if (tab.textContent === 'OUTPUT') setMeme('neutral', 'Program output is hidden. Only errors and unnecessary opinions are allowed.');
    else setMeme('neutral', `${tab.textContent} selected. Nothing important was found.`);
  });
});
updateLines(); updateCursor();
