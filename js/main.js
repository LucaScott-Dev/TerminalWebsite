const output = document.getElementById("output");
const cmdline = document.getElementById("cmdline");

const PROMPT = "visitor@luca:~$";

// ==========================
// COMMANDS
// ==========================

const commands = {
    help: () =>
`Available commands:

  help          Show this help menu

  clear         Clear the terminal

  about         Who the hell is Luca?

  socials       Where to find me

  projects      What I'm working on
`,

    about: () => "Not finished yet",
    socials: () => "Not finished yet",
    projects: () => "Not finished yet",

    clear: () => {
        output.innerHTML = "";
        return "";
    }
};

// ==========================
// TERMINAL CORE FUNCTIONS
// ==========================

function printLine(text = "", cls = "line") {
    const lines = String(text).split("\n");

    lines.forEach(segment => {
        const seg = document.createElement("div");

        if (segment === "") {
            seg.className = `${cls} blank`;
            seg.textContent = "\u00A0"; // needed to give line height
        } else {
            seg.className = cls;
            seg.textContent = segment;
        }

        output.appendChild(seg);
    });

    output.scrollTop = output.scrollHeight;
}

// ==========================
// EXECUTE COMMAND
// ==========================

function runCommand(input) {
    const trimmed = input.trim();

    // Show previous command
    printLine(`${PROMPT} ${trimmed}`, "line command");

    // Tight blank line after
    printLine("");

    if (!trimmed) return;

    const [cmd, ...args] = trimmed.split(" ");

    if (commands[cmd]) {
        const result = commands[cmd](args);
        if (result) printLine(result);
    } else {
        printLine(`Unknown command: ${cmd}`, "line error");
    }
}

// ==========================
// FOCUS HANDLING
// ==========================

function focusInput() {
    cmdline.focus();
}

// ==========================
// EVENT LISTENERS
// ==========================

cmdline.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        runCommand(cmdline.value);
        cmdline.value = "";
    }

    if (e.key === "c" && e.ctrlKey) {
        printLine(`${PROMPT} ${cmdline.value}`, "line command");
        printLine("");
        cmdline.value = "";
    }
});

document.addEventListener("click", focusInput);
window.addEventListener("load", focusInput);
window.addEventListener("focus", focusInput);