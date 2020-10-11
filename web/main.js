import { Bus } from "../emu/Bus.js";
import { Utils } from "../utils/Utils.js"

// THis is somewhat janky, but since it's temporary, I'm fine
// with it.

let atari2600 = new Bus(1.19);
let cpuinfo = atari2600.cpu.getInfo();
let domP = document.getElementById("disasm-out");


loadBinary("../roms/test00.bin").then((binSize) => {
    let disasm = atari2600.cpu.disassemble(0x0000, binSize/2, true);
    domP.innerHTML = disasm;

    atari2600.cpu.reset();
    while (atari2600.cpu.cycles) {
        atari2600.cpu.clock();
    }

    let pcAddrHtml = "";
    let ins = 0;
    $(document).on("keypress", e => {
        loop();
        ins++;
    })

    function loop() {
        $(pcAddrHtml).removeClass("current-instruction");
        let pc = Utils.padNumber((atari2600.cpu.pc).toString(16), 4);

        let flags = atari2600.cpu.flags;
        let flagList = "";
        for (const flagName in flags) {
            let flag = flags[flagName];
            if (flag) {
                flagList += "<span class=\"" + (flag.value ? "on" : "off") + "\">" + flag.char + "</span> ";
            }
        }

        let registers = "";
        for (const regName in atari2600.cpu.reg) {
            let reg = atari2600.cpu.reg[regName];
            if (reg) {
                let regVal = Utils.padNumber(Utils.toUnsigned(reg.value, 8).toString(16), 2);
                registers += reg.char + ": &nbsp;$" + regVal + " (" + reg.value + ")<br>";
            }
        }
        $("#cpu-status").html(registers + "PC: $" + pc + "<br>" + flagList);

        atari2600.cpu.clock();

        pcAddrHtml = "#S" + pc;
        $(pcAddrHtml).addClass("current-instruction");

        while (atari2600.cpu.cycles) {
            atari2600.cpu.clock();
        }
    }
    // ISSUE WITH RELATIVE ADDR CALCULATION

    // should improve this
    $("html").mousedown(() => {
        $("#disasm-out span").removeClass("highlight");
    });
});

function saveExecLog(log) {
    var blob = new Blob([log], {type: "text/html"});
    window.open(URL.createObjectURL(blob));
}

async function loadBinary(filename) {
    let rom = await (await fetch(filename)).arrayBuffer();
    atari2600.ram = new Uint8Array(rom);
    return rom.byteLength;
}
