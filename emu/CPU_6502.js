import { CPU } from "./CPU.js"
import { CPU_6502_OPCODES } from "./data/CPU_6502_OPCODES.js";
import { Utils } from "../utils/Utils.js";

// Registers:
// reg[0]: Accumulator
// reg[1]: X Register
// reg[2]: Y Register
class CPU_6502 extends CPU {
    constructor(clockSpeed, bus) {
        super();
        this.clockSpeed = clockSpeed;
        this.bus = bus;
        this.reg = {
            A: {
                char: "A",
                name: "Accumulator",
                value: 0x00
            },
            X: {
                char: "X",
                name: "X Register",
                value: 0x00
            },
            Y: {
                char: "Y",
                name: "Y Register",
                value: 0x00
            },
            status: {
                char: "S",
                name: "Status Register",
                value: 0x00
            }
        }
        this.flags = {
            C: {
                key: 0,
                char: "C",
                name: "Carry",
                value: 0b0
            },
            Z: {
                key: 1,
                char: "Z",
                name: "Zero",
                value: 0b0
            },
            I: {
                key: 2,
                char: "I",
                name: "Interrupt Disable",
                value: 0b0
            },
            D: {
                key: 3,
                char: "D",
                name: "Decimal Mode",
                value: 0b0
            },
            B: {
                key: 4,
                char: "B",
                name: "Break",
                value: 0b0
            },
            U: {
                key: 5,
                char: "U",
                name: "Unused",
                value: 0b0
            },
            V: {
                key: 6,
                char: "V",
                name: "Overflow",
                value: 0b0
            },
            N: {
                key: 7,
                char: "N",
                name: "Negative",
                value: 0b0
            },
        };
    }

    read(addr) {
        return this.bus.read(addr);
    }

    write(addr, data) {
        return this.bus.write(addr, data);
    }


    clock() {
        if (this.cycles == 0) {
            let opcode = this.read(this.pc); this.pc++;
            this.op = CPU_6502_OPCODES.find(op => op.code == opcode);
            let extraCycle0 = 0;
            let extraCycle1 = 0;

            this.cycles = this.op.cycles;
            extraCycle0 += this.handleAddrMode();
            extraCycle1 += this.handleOp();
            this.cycles += (extraCycle0 & extraCycle1);
        }

        this.cycles--;
    }

    reset() {

    }


    getFlag(flagName) {
        let flag = this.flags[flagName];
        return (this.reg["status"].value & (flag.value << flag.key)) >> flag.key;
    }

    // Value can be 0 or 1
    setFlag(flagName, value) {
        let flag = this.flags[flagName];
        flag.value = value;
        // Update status register
        if (value) {
            this.reg["status"].value |= (flag.value << flag.key);
        }
        else {
            this.reg["status"].value &= ~(1 << flag.key);
        }
    }

    // TODO: implement IZX and IZY
    handleAddrMode() {
        let extraCycles = 0;
        let lo = 0x00;
        let hi = 0x00;
        let ptr_lo = 0x00;
        let ptr_hi = 0x00;
        let ptr = 0x0000;

        switch (this.op.mode) {
            case "IMP":
                fetched = this.reg["A"];
                break;

            case "IMM":
                this.addr_abs = this.pc++;
                break;

            case "ZP0":
                this.addr_abs = this.read(this.pc);
                this.pc++;
                this.addr_abs &= 0x00FF;
                break;

            case "ZPX":
                this.addr_abs = this.read(this.pc) + this.reg["X"];
                this.pc++;
                this.addr_abs &= 0x00FF;
                break;

            case "ZPY":
                this.addr_abs = this.read(this.pc) + this.reg["Y"];
                this.pc++;
                this.addr_abs &= 0x00FF;
                break;

            case "ABS":
                lo = this.read(this.pc); this.pc++;
                hi = this.read(this.pc); this.pc++;
                this.addr_abs = (hi << 8) | lo;
                break;

            case "ABX":
                lo = this.read(this.pc); this.pc++;
                hi = this.read(this.pc); this.pc++;
                this.addr_abs = (hi << 8) | lo;
                this.addr_abs += this.reg[1];

                if ((this.addr_abs & 0xFF00) != (hi << 8)) extraCycles = 1;
                break;

            case "ABY":
                lo = this.read(this.pc); this.pc++;
                hi = this.read(this.pc); this.pc++;
                this.addr_abs = (hi << 8) | lo;
                this.addr_abs += this.reg[2];

                if ((this.addr_abs & 0xFF00) != (hi << 8)) extraCycles = 1;
                break;

            case "IND":
                ptr_lo = this.read(this.pc); this.pc++;
                ptr_hi = this.read(this.pc); this.pc++;
                ptr = (ptr_hi << 8) | ptr_lo;

                // Page boundary hardware bug emulation
                if (ptr_lo == 0x00FF) {
                    this.addr_abs = (this.read(ptr & 0xFF00) << 8) | this.read(ptr);
                }
                else {
                    this.addr_abs = (this.read(ptr + 1) << 8) | this.read(ptr);
                }
                break;

            case "IZX":
                break;
            case "IZY":
                break;

            case "REL":
                this.addr_rel = this.read(this.pc); this.pc++;

                // Make addr_rel signed
                if (this.addr_rel & 0x80) {
                    this.addr_rel |= 0xFF00;
                }
                break;

            default:
                throw new Error("Unknown")
        }

        return extraCycles;
    }

    // There are 56 legal instructions so this is pretty long.
    // Most of them are quite trivial though.
    handleOp() {
        let extraCycles = 0;

        switch (this.op.name) {
            case "ADC":
                break;
            case "AND":
                break;
            case "ASL":
                break;
            case "BCC":
                break;
            case "BCS":
                break;
            case "BEQ":
                break;
            case "BIT":
                break;
            case "BMI":
                break;
            case "BNE":
                break;
            case "BPL":
                break;
            case "BRK":
                break;
            case "BVC":
                break;
            case "BVS":
                break;
            case "CLC":
                break;
            case "CLD":
                break;
            case "CLI":
                break;
            case "CLV":
                break;
            case "CMP":
                break;
            case "CPX":
                break;
            case "CPY":
                break;
            case "DEC":
                break;
            case "DEC":
                break;
            case "DEY":
                break;
            case "EOR":
                break;
            case "INC":
                break;
            case "INX":
                break;
            case "INY":
                break;
            case "JMP":
                break;
            case "JSR":
                break;
            case "LDA":
                break;
            case "LDX":
                break;
            case "LDY":
                break;
            case "LSR":
                break;
            case "NOP":
                break;
            case "ORA":
                break;
            case "PHA":
                break;
            case "PHP":
                break;
            case "PLA":
                break;
            case "PLP":
                break;
            case "ROL":
                break;
            case "ROL":
                break;
            case "RTI":
                break;
            case "RTS":
                break;
            case "SBC":
                break;
            case "SEC":
                break;
            case "SEI":
                break;
            case "STA":
                break;
            case "STX":
                break;
            case "STY":
                break;
            case "TAX":
                break;
            case "TAY":
                break;
            case "TSX":
                break;
            case "TXA":
                break;
            case "TXS":
                break;
            case "TYA":
                break;
        }
    }

    getInfo() {
        let info = {
            name: "65XX Family Microprocessor",
            clockSpeed: this.clockSpeed,
            manufacturer: "Atari2600EMU"
        }
        return info;
    }

    // TODO: possibly rewrite disasm function to allow for more flexibility.
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
            if (op == undefined) { addr++; continue; }

            if (prettify) disasm += "<span class=hex-value-index>$" + Utils.padNumber((addr + 0xf000).toString(16), 4) + "</span>: ";
            else disasm += "$" + Utils.padNumber((addr + 0xf000).toString(16), 4) + ": ";

            if (prettify) disasm += "<span class=instruction>" + op.name + "</span>";
            else disasm += op.name + " ";

            addr++;

            lo = this.read(addr);
            if (lo == undefined) { addr++; continue; }
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