const output = document.getElementById("output");
const boot = document.getElementById("boot");
const cmdline = document.getElementById("cmdline");

const PROMPT = "visitor@luca:~$";

// =======================================
// TYPING ANIMATION
// =======================================
function typeText(text, cls = "line", speed = 20, target = output) {
    return new Promise(resolve => {
        const lines = text.split("\n");
        let i = 0;

        function typeNextLine() {
            if (i >= lines.length) return resolve();

            const segment = lines[i];
            const el = document.createElement("div");
            el.className = cls;
            target.appendChild(el);

            let idx = 0;

            function typeChar() {
                el.textContent = segment.substring(0, idx);
                idx++;

                if (idx <= segment.length) {
                    setTimeout(typeChar, speed);
                } else {
                    if (segment.trim() === "") el.classList.add("blank");
                    i++;
                    setTimeout(typeNextLine, speed);
                }
            }

            typeChar();
        }

        typeNextLine();
    });
}

// =======================================
// ASCII BANNER
// =======================================

const ASCII_BANNER = `
██╗     ██╗   ██╗ ██████╗ █████╗ ███████╗    ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗     
██║     ██║   ██║██╔════╝██╔══██╗██╔════╝    ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     
██║     ██║   ██║██║     ███████║███████╗       ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     
██║     ██║   ██║██║     ██╔══██║╚════██║       ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     
███████╗╚██████╔╝╚██████╗██║  ██║███████║       ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝       ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
                                                                                                                                                                    
`;

// =======================================
// COMMANDS
// =======================================

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

// =======================================
// PRINT LINE
// =======================================

function printLine(text = "", cls = "line", target = output) {
    const lines = String(text).split("\n");

    lines.forEach(segment => {
        const seg = document.createElement("div");

        if (segment === "") {
            seg.className = `${cls} blank`;
            seg.textContent = "\u00A0";
        } else {
            seg.className = cls;
            seg.textContent = segment;
        }

        target.appendChild(seg);
    });

    output.scrollTop = output.scrollHeight;
}

// =======================================
// EXECUTE COMMAND
// =======================================

async function runCommand(input) {
    const trimmed = input.trim();

    // Print command instantly
    printLine(`${PROMPT} ${trimmed}`, "line command");
    printLine("");

    if (!trimmed) return;

    const [cmd, ...args] = trimmed.split(" ");

    if (commands[cmd]) {
        const result = commands[cmd](args);
        if (result) {
            await typeText(result, "line", 12);
        }
    } else {
        await typeText(`Unknown command: ${cmd}`, "line error", 12);
    }
}

// =======================================
// FOCUS MANAGEMENT
// =======================================

function focusInput() {
    cmdline.focus();
}

// =======================================
// EVENT LISTENERS
// =======================================

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
window.addEventListener("focus", focusInput);

// =======================================
// BOOT SEQUENCE WITH ASCII BANNER + SPACER
// =======================================

window.addEventListener("load", async () => {
    focusInput();

    // Type ASCII banner (with preserved spacing)
    await typeText(ASCII_BANNER, "ascii", 3, boot);

    // Small spacer
    await typeText("", "boot-spacer", 0, boot);

    await typeText("Welcome to Luca's Terminal", "line accent", 18, boot);
    await typeText("Type help for a list of commands", "line", 18, boot);

    await typeText("", "boot-spacer", 0, boot);
});

