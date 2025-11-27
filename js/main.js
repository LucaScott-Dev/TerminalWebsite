const output = document.getElementById("output");
const boot = document.getElementById("boot");
const cmdline = document.getElementById("cmdline");

const PROMPT = "visitor@luca:~$";

// =======================================
// HELPER: pad strings for aligned columns
// =======================================
function pad(str, length) {
    return str + " ".repeat(Math.max(0, length - str.length));
}

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
                el.innerHTML = segment.substring(0, idx);
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
    help: () => {
        const entries = [
            ["help",     "Show this help menu"],
            ["clear",    "Clear the terminal"],
            ["about",    "Who the hell is Luca?"],
            ["socials",  "Where to find me"],
            ["projects", "What I'm working on"]
        ];

        return (
            "Available commands:\n\n" +
            entries
                .map(([cmd, desc]) =>
                    `  <span class="cmd">${pad(cmd, 12)}</span> ${desc}`
                )
                .join("\n\n")
        );
    },

    about: () => "Not finished yet",
    socials: () => {
        const entries = [
            ["GitHub:",     "https://github.com/LucaScott-Dev"],
            ["Instagram:",  "https://www.instagram.com/lucascott05/"],
            ["Linkedin:",    "https://www.linkedin.com/in/luca-scott-13a362397/"]
        ];

        return (
            "Social Links:\n\n" +
            entries
                .map(([name, url]) =>
                    `  <span class="cmd">${pad(name, 12)}</span> <a class="link" href="${url}" target="_blank">${url}</a>`
                )
                .join("\n\n")
        );
    },
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
            seg.innerHTML = segment;
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

    await typeText(ASCII_BANNER, "ascii", 3, boot);
    await typeText("", "boot-spacer", 0, boot);

    await typeText("Welcome to Luca's Terminal", "line accent", 18, boot);
    await typeText("Type help for a list of commands", "line", 18, boot);

    await typeText("", "boot-spacer", 0, boot);
});