import { Bus } from "../emu/Bus.js";
import { Utils } from "../utils/Utils.js"

let atari2600 = new Bus(1.19);
let cpuinfo = atari2600.cpu.getInfo();
let domP = document.getElementById("disasm-out");

console.log("0b" + Utils.padNumber(atari2600.cpu.reg["status"].value.toString(2), 8));

atari2600.cpu.setFlag("C", 1);
atari2600.cpu.setFlag("U", 1);
console.log("0b" + Utils.padNumber(atari2600.cpu.reg["status"].value.toString(2), 8));

loadBinary("../roms/pacman.bin").then(() => {
    let disasm = atari2600.cpu.disassemble(0x0000, 0x0D3E, true);
    domP.innerHTML += "'pacman.bin' -> CPU_6502.disassemble(0xf000, 0xfd3e): <br>" + disasm;
});


async function loadBinary(filename) {
    let rom = await (await fetch(filename)).arrayBuffer();
    atari2600.ram = new Uint8Array(rom);
}
