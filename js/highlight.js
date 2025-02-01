// manual syntax highlighting for .env files
function colorEnv(pre) {
    const lines = pre.textContent.split('\n');
    const coloredLines = lines.map(line => {
        const trimmedLine = line.replace(/\s+$/, '');
        if (trimmedLine.trim() === '') {
            return '';
        }
        if (trimmedLine.trim().startsWith('#')) {
            return `<span style="color: #6a9955;">${trimmedLine}</span>`;
        }
        // match KEY = VALUE lines
        const match = trimmedLine.match(/^(\s*[\w\d_]+)(\s*=\s*)(.*)$/);
        if (match) {
            const key = match[1];
            const operator = match[2];
            const value = match[3];
            return `<span style="color: #9cdcfe;">${key}</span>` +
                `<span style="color: #d4d4d4;">${operator}</span>` +
                `<span style="color: #ce9178;">${value}</span>`;
        }
        return trimmedLine;
    });
    pre.innerHTML = coloredLines.join('\n');
}

// manual syntax highlighting for bash scripts
function colorBash(pre) {
    // escape html to prevent injection
    const escapeHTML = (str) => {
        return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    };

    // find first unquoted '#' in the line
    const findCommentIndex = (line) => {
        let inSingle = false, inDouble = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === "'" && !inDouble) {
                inSingle = !inSingle;
            } else if (char === '"' && !inSingle) {
                inDouble = !inDouble;
            } else if (char === '#' && !inSingle && !inDouble) {
                return i;
            }
        }
        return -1;
    };

    // apply highlighting rules to a code part of the line
    const highlightCodePart = (code) => {
        // highlight strings (single or double quoted)
        code = code.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, (match) => `<span style="color: #ce9178;">${match}</span>`);
        // highlight variables ($var or ${var})
        code = code.replace(/\$[a-zA-Z_][a-zA-Z0-9_]*|\$\{[^}]+\}/g, (match) => `<span style="color: #9cdcfe;">${match}</span>`);
        // highlight reserved keywords (e.g., if, then, else, fi, for, while, do, done, function, case, esac, in)
        code = code.replace(/\b(if|then|else|fi|for|while|do|done|function|case|esac|in)\b/g, (match) => `<span style="color: #569cd6;">${match}</span>`);
        // highlight the first token (command) if not already wrapped by a span
        code = code.replace(/^(\s*\S+)/, (match) => `<span style="color: #569cd6;">${match}</span>`);
        return code;
    };

    // process each line of the <pre> element
    const lines = pre.textContent.split('\n');
    const coloredLines = lines.map((line) => {
        const escapedLine = escapeHTML(line);
        if (escapedLine.trim() === '') return '';
        // if the whole line is a comment, color it green
        if (escapedLine.trim().startsWith('#')) {
            return `<span style="color: #6a9955;">${escapedLine}</span>`;
        }
        // check for inline comments (ignoring those inside strings)
        const commentIndex = findCommentIndex(escapedLine);
        if (commentIndex !== -1) {
            const codePart = escapedLine.slice(0, commentIndex);
            const commentPart = escapedLine.slice(commentIndex);
            return `${highlightCodePart(codePart)}<span style="color: #6a9955;">${commentPart}</span>`;
        } else {
            return highlightCodePart(escapedLine);
        }
    });
    pre.innerHTML = coloredLines.join('\n');
}

// manual syntax highlighting for JavaScript code
function colorJS(pre) {
    let text = pre.textContent;
    // highlight single-line comments
    text = text.replace(/(\/\/.*)/g, '<span style="color: #6a9955;">$1</span>');
    // highlight some common keywords
    text = text.replace(/\b(const|let|var|function|return|if|else)\b/g, '<span style="color: #569cd6;">$1</span>');
    pre.innerHTML = text;
}

// manual syntax highlighting for Python code
function colorPython(pre) {
    let text = pre.textContent;
    // highlight comments
    text = text.replace(/(#.*)/g, '<span style="color: #6a9955;">$1</span>');
    // highlight some common keywords
    text = text.replace(/\b(def|import|from|class|return|if|else|elif|for|while|try|except|with|as|pass)\b/g, '<span style="color: #569cd6;">$1</span>');
    pre.innerHTML = text;
}

function colorMake(pre) {
    // split the code block into lines
    const lines = pre.textContent.split('\n');
    // map over each line to apply coloring
    const coloredLines = lines.map(line => {
        // remove trailing whitespace
        const trimmedLine = line.replace(/\s+$/, '');
        // if the line is empty, return an empty string
        if (trimmedLine.trim() === '') {
            return '';
        }
        // if the line is a comment, color it green
        if (trimmedLine.trim().startsWith('#')) {
            return `<span style="color: #6a9955;">${trimmedLine}</span>`;
        }
        // match lines that start with "make" followed by whitespace and a target
        const match = trimmedLine.match(/^(make)(\s+)(\S.*)$/);
        if (match) {
            const command = match[1];     // the word "make"
            const whitespace = match[2];  // the space(s) after "make"
            const target = match[3];      // the target command and parameters
            // color "make" in light blue, the whitespace in default, and the target in light orange
            return `<span style="color: #569cd6;">${command}</span>` +
                `<span style="color: #d4d4d4;">${whitespace}</span>` +
                `<span style="color: #ce9178;">${target}</span>`;
        }
        // if no match, just return the line as is
        return trimmedLine;
    });
    // join the lines back together and update the code block's innerHTML
    pre.innerHTML = coloredLines.join('\n');
}


// add copy buttons to all <pre> elements containing code
function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre');
    codeBlocks.forEach((pre) => {
        // create the copy button element
        const button = document.createElement('button');
        button.textContent = 'copy';
        button.classList.add('copy-btn');
        // add click listener to copy the code content to clipboard
        button.addEventListener('click', () => {
            // -4 to remove the button text from the content copied
            navigator.clipboard.writeText(pre.textContent.substring(0, pre.textContent.length - 4)).then(() => {
                button.textContent = 'copied!';
                setTimeout(() => {
                    button.textContent = 'copy';
                }, 2000);
            }).catch((error) => {
                console.error('failed to copy code:', error);
            });
        });
        // position the button at the top right of the code block
        pre.style.position = 'relative';
        button.style.position = 'absolute';
        button.style.top = '8px';
        button.style.right = '8px';
        button.style.padding = '4px 8px';
        button.style.fontSize = '12px';
        pre.appendChild(button);
    });
}

// run the appropriate function based on the code block's class
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.env-block').forEach(colorEnv);
    document.querySelectorAll('.bash-block').forEach(colorBash);
    document.querySelectorAll('.js-block').forEach(colorJS);
    document.querySelectorAll('.python-block').forEach(colorPython);
    document.querySelectorAll('.make-block').forEach(colorMake);
    addCopyButtons();
});