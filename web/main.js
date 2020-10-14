import { Bus } from "../emu/Bus.js";
import { Utils } from "../utils/Utils.js"

// THis is somewhat janky, but since it's temporary, I'm fine
// with it.

let atari2600 = new Bus(1.19);
let cpuinfo = atari2600.cpu.getInfo();
let domP = document.getElementById("disasm-out");
let iFrame = 0;

// BUG: ADC doesnt get highlighted

function drawScreen(frameRate) {
    let cv = document.getElementById("screen");
    let ctx = cv.getContext("2d");
    let frame = ctx.createImageData(cv.width, cv.height);

    for (let y = 0; y < cv.height; y++) {
        for (let x = 0; x < cv.width; x++) {
            let i = (x + y * cv.width) * 4; // R G B A
            frame.data[i + 0] = Math.cos(iFrame/frameRate + x/cv.width) * 255;
            frame.data[i + 1] = Math.cos(iFrame/frameRate + y/cv.height) * 255;
            frame.data[i + 2] = 255;
            frame.data[i + 3] = 255;
        }
    }
    ctx.putImageData(frame, 0, 0);
    iFrame++;
}

loadBinary("../roms/test00.bin").then((bin) => {
    atari2600.ram = new Uint8Array(0xFFFF);
    let binSize = bin.byteLength || bin.length;

    // Draw screen @ 60hz
    let frameRate = 60;
    setInterval(drawScreen, 1000/frameRate, frameRate);

    atari2600.cpu.reset();
    while (atari2600.cpu.cycles) {
        atari2600.cpu.clock();
    }

    // Load program @ 0x8000
    for (let i = 0; i < binSize; i++) {
        atari2600.ram[i+0x8000] = bin[i];
    } atari2600.cpu.pc = 0x8000;

    let disasm = atari2600.cpu.disassemble(0x8000, 0x8000 + binSize-1, true);
    domP.innerHTML = disasm;

    let pcAddrHtml = "";
    $(document).on("keypress", e => {
        loop();
    })

    function loop() {
        $(pcAddrHtml).removeClass("current-instruction");
        let pc = Utils.padNumber((atari2600.cpu.pc).toString(16), 4);
        let stkp = Utils.padNumber((atari2600.cpu.stkp).toString(16), 4);

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
        $("#cpu-status").html(registers + "PC: $" + pc + "<br>" + "ST: $" + stkp + "<br>" + flagList);

        // Memory view
        let ramContents = viewRam(0x0000, 0x0020);
        ramContents += viewRam(0x8000, 0x8040);
        $("#memory-view").html(ramContents);

        function viewRam(start, end) {
            let contents = "<i><b>------ 00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f</i></b>";
            for (let y = start / 16; y <= end / 16; y++) {
                contents += "<br>$" + Utils.padNumber((y * 16).toString(16), 4) + ": ";
                for (let x = 0; x < 16; x++) {
                    let val = atari2600.ram[x + y * 16];
                    contents += Utils.padNumber(val.toString(16), 2) + " ";
                }
                
            }
            return contents + "<br><br>";
        }

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

async function loadBinary(filename) {
    // multiplication program (3 * 10)
    let testbin = "A2 0A 8E 00 00 A2 03 8E 01 00 AC 00 00 A9 00 18 6D 01 00 88 D0 FA 8D 02 00 4C 19 80";
    // let rom = await (await fetch(filename)).arrayBuffer();
    let data = testbin.split(" ").map(el => parseInt(el, 16));

    return new Uint8Array(data);
}
