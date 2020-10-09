import { CPU } from "./CPU.js"
import { CPU_6502_OPCODES } from "./data/CPU_6502_OPCODES.js";
import { Utils } from "../utils/Utils.js";

// TODO: implement addresing modes and instructions

class CPU_6502 extends CPU {
    constructor(clockSpeed, bus) {
        super();
        this.clockSpeed = clockSpeed;
        this.bus = bus;
        this.r = new Array(4) // A, X, Y + Status
        this.flags = [
            {
                key: 0,
                char: "C",
                name: "Carry",
                val: 0b0
            },
            {
                key: 1,
                char: "Z",
                name: "Zero",
                val: 0b0
            },
            {
                key: 2,
                char: "I",
                name: "Interrupt Disable",
                val: 0b0
            },
            {
                key: 3, // Unused i think
                char: "D",
                name: "Decimal Mode",
                val: 0b0
            },
            {
                key: 4,
                char: "B",
                name: "Break",
                val: 0b0
            },
            {
                key: 5,
                char: "U",
                name: "Unused",
                val: 0b0
            },
            {
                key: 6,
                char: "V",
                name: "Overflow",
                val: 0b0
            },
            {
                key: 7,
                char: "N",
                name: "Negative",
                val: 0b0
            },
        ];
    }

    read(addr) {
        return this.bus.read(addr);
    }

    write(addr, data) {
        return this.bus.write(addr, data);
    }

    getInfo() {
        let info = {
            name: "65XX Family Microprocessor",
            clockSpeed: this.clockSpeed,
            manufacturer: "Atari2600EMU"
        }
        return info;
    }

    // With prettify = true, spans are added for custom styling.
    disassemble(start, stop, prettify = false) {
        let addr = start;
        let disasm = "";
        let lo = 0x00;
        let hi = 0x00;


        // TODO: with prettify enabled, have relative addresses link to index (i know what i mean)
        // TODO: implement "IND" prettifying
        while (addr <= stop) {
            let op = CPU_6502_OPCODES.find(opcode => opcode.code == this.read(addr));
            if (op == undefined) {addr++; continue;}

            if (prettify) disasm += "<span class=hex-value-index>$" + Utils.padNumber((addr + 0xf000).toString(16), 4) + "</span>: ";
            else disasm += "$" + Utils.padNumber((addr + 0xf000).toString(16), 4) + ": ";

            if (prettify) disasm += "<span class=instruction>" + op.name + "</span>";
            else disasm += op.name + " ";

            addr++;

            lo = this.read(addr);
            if (lo == undefined) { addr++; continue;}
            else lo = lo.toString(16);

            addr++;

            switch (op.mode) {
                case "IMP":
                    addr--;
                    break;

                case "IMM":
                    if (prettify) disasm += " <span class=hex-value-implied>";
                    disasm += " #$" + Utils.padNumber(lo, 2);
                    if (prettify) disasm += "</span>";

                    break;

                case "ZP0":
                    if (prettify) disasm += " <span class=hex-value>";
                    disasm += " $" + Utils.padNumber(lo, 2);
                    if (prettify) disasm += "</span>";
                    break;

                case "IZX":
                case "ZPX":
                    if (prettify) disasm += " <span class=hex-value>";
                    disasm += " $" + Utils.padNumber(lo, 2);
                    if (prettify) disasm += "</span>, <span class=register>X</span>";
                    else disasm += ", X";

                    break;

                case "IZY":
                case "ZPY":
                    if (prettify) disasm += " <span class=hex-value>";
                    disasm += " $" + Utils.padNumber(lo, 2);
                    if (prettify) disasm += "</span>, <span class=register>Y</span>";
                    else disasm += ", Y";
                    break;

                case "ABS":
                    hi = this.read(addr).toString(16); addr++;
                    if (prettify) disasm += " <span class=hex-value>";
                    disasm += " $" + Utils.padNumber((hi + lo), 4);
                    if (prettify) disasm += "</span>";

                    break;

                case "ABX":
                    hi = this.read(addr).toString(16); addr++;
                    if (prettify) disasm += " <span class=hex-value>";
                    disasm += " $" + Utils.padNumber((hi + lo), 4);
                    if (prettify) disasm += "</span>, <span class=register>X</span>";
                    else disasm += ", X";

                    break;

                case "ABY":
                    hi = this.read(addr).toString(16); addr++;
                    if (prettify) disasm += " <span class=hex-value>";
                    disasm += " $" + Utils.padNumber((hi + lo), 4);
                    if (prettify) disasm += "</span>, <span class=register>X</span>";
                    else disasm += ", X";

                    break;

                case "IND":
                    hi = this.read(addr).toString(16); addr++;
                    disasm += " ($" + Utils.padNumber((hi + lo), 4) + ")";
                    break;

                case "REL":
                    if (prettify) disasm += " <span class=hex-value-relative>[$" + Utils.padNumber((addr + Utils.toSigned(parseInt(lo, 16), 8)).toString(16), 4) + "]</span>";
                    else disasm += " [$" + Utils.padNumber((addr + Utils.toSigned(parseInt(lo, 16), 8)).toString(16), 4) + "]";
                    break;
            }
            if (!op.legal) {
                disasm += " (ILLEGAL)";
            }

            disasm += "<br>";
        }
        
        return disasm;
    }
}

export { CPU_6502 };