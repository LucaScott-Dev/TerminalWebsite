/* ============================================================
   DOM REFERENCES
============================================================ */
const output = document.getElementById("output");
const boot = document.getElementById("boot");
const cmdline = document.getElementById("cmdline");

const PROMPT = "visitor@luca:~$";
let awaitingMatrixAnswer = false;

/* ============================================================
   HELPERS
============================================================ */

// pad for aligned formatting
const pad = (str, len) => str + " ".repeat(Math.max(0, len - str.length));


/* ============================================================
   TYPING ANIMATION
============================================================ */
function typeText(text, cls = "line", speed = 20, target = output) {
    return new Promise(resolve => {
        const lines = text.split("\n");
        let i = 0;

        function nextLine() {
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
                    if (!segment.trim()) el.classList.add("blank");
                    i++;
                    setTimeout(nextLine, speed);
                }
            }

            typeChar();
        }

        nextLine();
    });
}


/* ============================================================
   MATRIX RAIN (ACCENT COLOR)
============================================================ */
function runMatrixRain(duration = 4000) {
    const canvas = document.getElementById("matrix-canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    let running = true;

    function draw() {
        if (!running) return;
        requestAnimationFrame(draw);

        ctx.fillStyle = "rgba(0,0,0,0.07)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // accent blue
        ctx.fillStyle = "#5EDAFD";
        ctx.font = fontSize + "px monospace";

        drops.forEach((y, i) => {
            const char = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(char, i * fontSize, y * fontSize);

            if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;

            drops[i]++;
        });
    }

    draw();

    setTimeout(() => {
        running = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, duration);
}


/* ============================================================
   ASCII BANNER
============================================================ */
const ASCII_BANNER = `
██╗     ██╗   ██╗ ██████╗ █████╗ ███████╗    ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗     
██║     ██║   ██║██╔════╝██╔══██╗██╔════╝    ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     
██║     ██║   ██║██║     ███████║███████╗       ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     
██║     ██║   ██║██║     ██╔══██║╚════██║       ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     
███████╗╚██████╔╝╚██████╗██║  ██║███████║       ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝       ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
`;


/* ============================================================
   COMMANDS
============================================================ */
const commands = {

    help: () => {
        const items = [
            ["help",     "Show this help menu"],
            ["clear",    "Clear the terminal"],
            ["about",    "Who the hell is Luca?"],
            ["socials",  "Where to find me"],
            ["projects", "What I'm working on"],
            ["matrix",   "Choose your fate"]
        ];

        return (
            "Available commands:\n\n" +
            items
                .map(([cmd, desc]) =>
                    `  <span class="cmd">${pad(cmd, 12)}</span> ${desc}`
                )
                .join("\n\n")
        );
    },

    about: () => "Not finished yet",

    socials: () => {
        const items = [
            ["GitHub:",    "https://github.com/LucaScott-Dev"],
            ["Instagram:", "https://www.instagram.com/lucascott05/"],
            ["LinkedIn:",  "https://www.linkedin.com/in/luca-scott-13a362397/"]
        ];

        return (
            "Social Links:\n\n" +
            items
                .map(([name, url]) =>
                    `  <span class="cmd">${pad(name, 12)}</span> <a class="link" href="${url}" target="_blank">${url}</a>`
                )
                .join("\n\n")
        );
    },

    projects: () => "Not finished yet",

    matrix: () => {
        awaitingMatrixAnswer = true;

        return `
You take the <span class="cmd">blue pill</span> — the story ends.
You wake up in your bed and believe whatever you want to believe.

You take the <span class="cmd">red pill</span> — you stay in Wonderland,
and I show you how deep the rabbit hole goes.

Type: <span class="cmd">red</span> or <span class="cmd">blue</span>
`;
    },

    clear: () => {
        output.innerHTML = "";
        return "";
    }
};


/* ============================================================
   PRINT LINE
============================================================ */
function printLine(text = "", cls = "line", target = output) {
    const lines = text.split("\n");

    for (const seg of lines) {
        const el = document.createElement("div");
        el.className = seg === "" ? `${cls} blank` : cls;
        el.innerHTML = seg || "&nbsp;";
        target.appendChild(el);
    }

    target.scrollTop = target.scrollHeight;
}


/* ============================================================
   COMMAND EXECUTION
============================================================ */
async function runCommand(input) {
    const trimmed = input.trim();

    printLine(`${PROMPT} ${trimmed}`, "line command");
    printLine("");

    if (!trimmed) return;

    // MATRIX ANSWER MODE
    if (awaitingMatrixAnswer) {
        const answer = trimmed.toLowerCase();

        if (answer === "red") {
            printLine("Welcome to Wonderland…", "line accent");
            runMatrixRain();

        } else if (answer === "blue") {
            output.innerHTML = "";
            boot.innerHTML = "";
            printLine("The story ends. Everything resets…", "line");
            setTimeout(() => location.reload(), 1200);

        } else {
            printLine("That’s not a choice, Neo.", "line error");
        }

        awaitingMatrixAnswer = false;
        return;
    }

    // NORMAL COMMANDS
    const [cmd, ...args] = trimmed.split(" ");

    if (commands[cmd]) {
        const result = commands[cmd](args);
        if (result) await typeText(result, "line", 12);
    } else {
        await typeText(`Unknown command: ${cmd}`, "line error", 12);
    }
}


/* ============================================================
   INPUT FOCUS
============================================================ */
const focusInput = () => cmdline.focus();

cmdline.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        runCommand(cmdline.value);
        cmdline.value = "";
    }

    if (e.ctrlKey && e.key === "c") {
        printLine(`${PROMPT} ${cmdline.value}`, "line command");
        printLine("");
        cmdline.value = "";
    }
});

document.addEventListener("click", focusInput);
window.addEventListener("focus", focusInput);


/* ============================================================
   BOOT SEQUENCE
============================================================ */
window.addEventListener("load", async () => {
    focusInput();

    await typeText(ASCII_BANNER, "ascii", 3, boot);
    await typeText("", "boot-spacer", 0, boot);

    await typeText("Welcome to Luca's Terminal", "line accent", 18, boot);
    await typeText("Type help for a list of commands", "line", 18, boot);

    await typeText("", "boot-spacer", 0, boot);
});