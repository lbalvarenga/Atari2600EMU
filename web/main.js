import { Bus } from "../emu/Bus.js";
import { Utils } from "../utils/Utils.js"

let atari2600 = new Bus(1.19);
let cpuinfo = atari2600.cpu.getInfo();
let domP = document.getElementById("disasm-out");


loadBinary("../roms/test00.bin").then(() => {
    let disasm = atari2600.cpu.disassemble(0x0000, 0x0010, true);
    domP.innerHTML = disasm;

    atari2600.cpu.reset();
    while (atari2600.cpu.cycles) {
        atari2600.cpu.clock();
    }

    let i = 0;
    let log = "<style>body{font-family:monospace;font-size:1.4em;background-color:black;color:white;}</style>";

    log += "Code execution for 20 instructions: <br><br>"
    while (i < 20) {
        let pc = Utils.padNumber((atari2600.cpu.pc).toString(16), 4);
        let flags = atari2600.cpu.flags;
        let flagList = "";
        for (const flagName in flags) {
            let flag = flags[flagName];
            if (flag) {
                flagList += flag.char + ": " + (flag.value ? "1" : "0") + "; ";
            }
        }

        atari2600.cpu.clock();


        log += ("INSTRUCTION: " + i) + "<br>";
        log += ("PC = 0x" + pc) + "<br>";
        log += ("OP = " + atari2600.cpu.op.name) + "<br>";
        log += (flagList) + "<br><br>";

        while (atari2600.cpu.cycles) {
            atari2600.cpu.clock();
        }

        i++;
    }

    saveExecLog(log);
    // ISSUE WITH RELATIVE ADDR CALCULATION

});

function saveExecLog(log) {
    var blob = new Blob([log], {type: "text/html"});
    window.open(URL.createObjectURL(blob));
}

async function loadBinary(filename) {
    let rom = await (await fetch(filename)).arrayBuffer();
    atari2600.ram = new Uint8Array(rom);
}
