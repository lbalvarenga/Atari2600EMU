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

    // Processor-specific constants
    ADDR_STACK_BASE   = 0x0100;
    ADDR_RESET_LOOKUP = 0xFFFC;

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

    fetch() {
        if (!(this.op.mode == "IMP")) {
            this.fetched = this.read(this.addr_abs);
        }
        return this.fetched;
    }

    reset() {
        for (const regName in this.reg) {
            let register = this.reg[regName]
            if (register) {
                register.value = 0;
            }
        }

        // Gets program counter address
        this.addr_abs = this.ADDR_RESET_LOOKUP;
        let lo = this.read(this.addr_abs);
        let hi = this.read(this.addr_abs + 1);
        this.pc = (hi << 8) | lo;

        this.addr_rel = 0x00;
        this.addr_abs = 0x0000;
        this.fetched = 0x00;

        this.cycles = 8;
    }

    // TODO: implement interrupts (nmi and irq)

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

        // Cast to 8 bits
        this.reg["status"].value &= 0x00FF;
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
                this.fetched = this.reg["A"].value;
                break;

            case "IMM":
                this.addr_abs = this.pc++; // i'm not sure I understand the ++ tbh
                break;

            case "ZP0":
                this.addr_abs = this.read(this.pc);
                this.pc++;
                this.addr_abs &= 0x00FF;
                break;

            case "ZPX":
                this.addr_abs = this.read(this.pc) + this.reg["X"].value;
                this.pc++;
                this.addr_abs &= 0x00FF;
                break;

            case "ZPY":
                this.addr_abs = this.read(this.pc) + this.reg["Y"].value;
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
                this.addr_abs += this.reg["X"].value;

                if ((this.addr_abs & 0xFF00) != (hi << 8)) extraCycles = 1;
                break;

            case "ABY":
                lo = this.read(this.pc); this.pc++;
                hi = this.read(this.pc); this.pc++;
                this.addr_abs = (hi << 8) | lo;
                this.addr_abs += this.reg["Y"].value;

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
                throw new Error("Not implemented.");
                break;
            case "IZY":
                throw new Error("Not implemented.")
                break;

            case "REL":
                this.addr_rel = this.read(this.pc); this.pc++;

                // addr_rel = (addr + Utils.toSigned(parseInt(lo, 16), 8));

                // Make addr_rel signed (not working)
                if (this.addr_rel & 0x80) {
                    this.addr_rel = Utils.toSigned(this.addr_rel, 8);
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
        let res, val, shifted;

        // TODO: implement BRK
        switch (this.op.name) {
            case "ADC":
                this.fetch();
                res = this.reg["A"].value + this.fetched + this.getFlag("C");
                this.setFlag("C", res > 255);
                this.setFlag("Z", !(res & 0x00FF));
                this.setFlag("N", res & 0x80);

                // For more information regarding overflow:
                // https://youtu.be/8XmxKPJDGU0?t=2842
                this.setFlag("V", ((this.reg["A"].value ^ res) & ~(this.reg["A"].value ^ this.fetched)) & 0x0080);
                this.reg["A"].value = res & 0x00FF;
                break;

            case "AND":
                this.fetch(); // Gets contents of whats at addr_abs
                this.reg["A"].value = this.reg["A"].value & this.fetched;

                this.setFlag("Z", !(this.reg["A"].value));
                this.setFlag("N", this.reg["A"].value & 0x80);

                extraCycles = 1;
                break;

            case "ASL":
                this.fetch(); // If mode is IMP we'll get the accumulator
                shifted = this.fetched << 1;

                this.setFlag("C", (shifted & 0xFF00) > 0);
                this.setFlag("Z", !(shifted & 0x00FF));
                this.setFlag("N", shifted & 0x80);

                if (this.op.mode == "IMP") this.reg["A"].value = shifted & 0x00FF;
                else this.write(this.addr_abs, shifted & 0x00FF);
                break;

            case "BCC":
                if (!(this.getFlag("C"))) {
                    this.cycles++;
                    this.addr_abs = this.pc + this.addr_rel;

                    // Page boundary check
                    if ((this.addr_abs & 0xFF00) != (this.pc & 0xFF00)) {
                        this.cycles++;
                    }

                    this.pc = this.addr_abs;
                }
                break;

            case "BCS":
                if (this.getFlag("C")) {
                    this.cycles++;
                    this.addr_abs = this.pc + this.addr_rel;

                    // Page boundary check
                    if ((this.addr_abs & 0xFF00) != (this.pc & 0xFF00)) {
                        this.cycles++
                    }

                    this.pc = this.addr_abs;
                }
                break;

            case "BEQ":
                if (this.getFlag("Z")) {
                    this.cycles++;
                    this.addr_abs = this.pc + this.addr_rel;

                    // Page boundary check
                    if ((this.addr_abs & 0xFF00) != (this.pc & 0xFF00)) {
                        this.cycles++;
                    }

                    this.pc = this.addr_abs;
                }
                break;

            case "BIT":
                this.fetch();
                res = this.reg["A"].value & this.fetched;
                this.setFlag("Z", !(res & 0x00FF));
                this.setFlag("V", res & (1 << 7));
                this.setFlag("N", res & (1 << 6));
                break;

            case "BMI":
                if (this.getFlag("N")) {
                    this.cycles++;
                    this.addr_abs = this.pc + this.addr_rel;

                    // Page boundary check
                    if ((this.addr_abs & 0xFF00) != (this.pc & 0xFF00)) {
                        this.cycles++;
                    }

                    this.pc = this.addr_abs;
                }
                break;

            // Temporary relative address fix (not sure if correct)
            case "BNE":
                if (!(this.getFlag("Z"))) {
                    this.cycles++;
                    this.addr_abs = this.pc + this.addr_rel;

                    // Page boundary check
                    if ((this.addr_abs & 0xFF00) != (this.pc & 0xFF00)) {
                        this.cycles++;
                    }

                    this.pc = this.addr_abs;
                }
                break;

            case "BPL":
                if (!(this.getFlag("N"))) {
                    this.cycles++;
                    this.addr_abs = this.pc + this.addr_rel;

                    // Page boundary check
                    if ((this.addr_abs & 0xFF00) != (this.pc & 0xFF00)) {
                        this.cycles++;
                    }

                    this.pc = this.addr_abs;
                }
                break;

            case "BRK":
                break;

            case "BVC":
                if (!(this.getFlag("V"))) {
                    this.cycles++;
                    this.addr_abs = this.pc + this.addr_rel;

                    // Page boundary check
                    if ((this.addr_abs & 0xFF00) != (this.pc & 0xFF00)) {
                        this.cycles++;
                    }

                    this.pc = this.addr_abs;
                }
                break;

            case "BVS":
                if (this.getFlag("V")) {
                    this.cycles++;
                    this.addr_abs = this.pc + this.addr_rel;

                    // Page boundary check
                    if ((this.addr_abs & 0xFF00) != (this.pc & 0xFF00)) {
                        this.cycles++;
                    }

                    this.pc = this.addr_abs;
                }
                break;

            case "CLC":
                this.setFlag("C", false);
                break;

            case "CLD":
                this.setFlag("D", false);
                break;

            case "CLI":
                this.setFlag("I", false);
                break;

            case "CLV":
                this.setFlag("V", false);
                break;

            case "CMP":
                this.fetch();

                this.setFlag("C", this.fetched <  this.reg["A"].value);
                this.setFlag("Z", ((this.reg["A"].value - this.fetched) & 0x00FF) == 0x0000);
                this.setFlag("N", (this.reg["A"].value - this.fetched) & 0x0080);

                extraCycles = 1;
                break;

            case "CPX":
                this.fetch();

                this.setFlag("C", this.fetched <  this.reg["X"].value);
                this.setFlag("Z", ((this.reg["X"].value - this.fetched) & 0x00FF) == 0x0000);
                this.setFlag("N", (this.reg["X"].value - this.fetched) & 0x0080);

                extraCycles = 1;
                break;

            case "CPY":
                this.fetch();

                this.setFlag("Z", ((this.reg["Y"].value - this.fetched) & 0x00FF) == 0x0000);
                this.setFlag("C", this.fetched <  this.reg["Y"].value);
                this.setFlag("N", (this.reg["Y"].value - this.fetched) & 0x0080);

                extraCycles = 1;
                break;

            case "DEC":
                this.fetch();

                res = this.fetched - 1;
                this.write(this.addr_abs, res);

                this.setFlag("Z", !(res & 0x00FF));
                this.setFlag("N", res & 0x0080);
                break;

            case "DEX":
                this.reg["X"].value--;

                this.setFlag("Z", !(this.reg["X"].value));
                this.setFlag("N", this.reg["X"].value & 0x80);
                break;

            case "DEY":
                this.reg["Y"].value--;

                this.setFlag("Z", !(this.reg["Y"].value));
                this.setFlag("N", this.reg["Y"].value & 0x80);
                break;

            case "EOR":
                this.fetch();

                this.reg["A"].value = this.reg["A"].value ^ this.fetched;

                this.setFlag("Z", !(this.reg["A"].value));
                this.setFlag("N", this.reg["A"].value & 0x80);

                break;

            case "INC":
                this.fetch();

                res = this.fetched + 1;
                this.write(this.addr_abs, res);

                this.setFlag("Z", !(res & 0x00FF));
                this.setFlag("N", res & 0x0080);
                break;

            case "INX":
                this.reg["X"].value++;

                this.setFlag("Z", !(this.reg["X"].value));
                this.setFlag("N", this.reg["X"].value & 0x80);
                break;

            case "INY":
                this.reg["Y"].value++;

                this.setFlag("Z", !(this.reg["Y"].value));
                this.setFlag("N", this.reg["Y"].value & 0x80);
                break;

            case "JMP":
                this.pc = this.addr_abs;
                break;

            case "JSR":
                this.pc--;

                this.write(this.ADDR_STACK_BASE + this.stkp, (this.pc >> 8) & 0x00FF);
                this.stkp--;
                this.write(this.ADDR_STACK_BASE + this.stkp, this.pc & 0x00FF);
                this.stkp--;

                this.pc = this.addr_abs;
                break;

            case "LDA":
                this.fetch();

                this.reg["A"].value = this.fetched;

                this.setFlag("Z", !(this.reg["A"].value));
                this.setFlag("N", this.reg["A"].value & 0x80);

                extraCycles = 1;
                break;

            case "LDX":
                this.fetch();

                this.reg["X"].value = this.fetched;

                this.setFlag("Z", !(this.reg["X"].value));
                this.setFlag("N", this.reg["X"].value & 0x80);

                extraCycles = 1;
                break;

            case "LDY":
                this.fetch();

                this.reg["Y"].value = this.fetched;

                this.setFlag("Z", !(this.reg["Y"].value));
                this.setFlag("N", this.reg["Y"].value & 0x80);

                extraCycles = 1;
                break;

            case "LSR":
                this.fetch(); // If mode is IMP we'll get the accumulator
                let shifted = this.fetched >> 1;

                this.setFlag("C", this.fetched & 0x0001);
                this.setFlag("Z", !(shifted & 0x00FF));
                this.setFlag("N", shifted & 0x80);

                if (this.op.mode == "IMP") this.reg["A"].value = shifted & 0x00FF;
                else this.write(this.addr_abs, shifted & 0x00FF);
                break;

            case "NOP":
                // NOPs can be different depending on the opcode
                // for now, they don't add any cycles, but that's inaccurate.
                break;

            case "ORA":
                this.fetch(); // Gets contents of whats at addr_abs
                this.reg["A"].value = this.reg["A"].value | this.fetched;

                this.setFlag("Z", !(this.reg["A"].value));
                this.setFlag("N", this.reg["A"].value & 0x80);

                extraCycles = 1;
                break;

            case "PHA":
                this.write(ADDR_STACK_BASE + this.stkp, this.reg["A"].value);
                this.stkp--;
                break;

            case "PHP":
                break;

            case "PLA":
                this.stkp++;
                this.reg["A"].value = this.read(ADDR_STACK_BASE + this.stkp);
                this.setFlag("Z", !(this.reg["A"].value));
                this.setFlag("N", this.reg["A"].value & 0x80);
                break;

            case "PLP":
                break;
            case "ROL":
                break;
            case "ROR":
                break;
            case "RTI":
                break;
            case "RTS":
                break;

            case "SBC":
                this.fetch();

                val = fetch ^ 0x00FF;
                res = this.reg["A"].value + val + this.getFlag("C");

                this.setFlag("C", res > 255);
                this.setFlag("Z", (res & 0x00FF) == 0);
                this.setFlag("N", res & 0x80);

                // For more information regarding overflow:
                // https://youtu.be/8XmxKPJDGU0?t=2842
                this.setFlag("V", ((this.reg["A"].value ^ res) & (res ^ val)) & 0x0080);
                this.reg["A"].value = res & 0x00FF;
                break;

            case "SEC":
                this.setFlag("C", true);
                break;

            case "SED":
                this.setFlag("D", true);
                break;

            case "SEI":
                this.setFlag("I", true);
                break;

            case "STA":
                this.write(this.addr_abs, this.reg["A"].value);
                break;

            case "STX":
                this.write(this.addr_abs, this.reg["X"].value);
                break;

            case "STY":
                this.write(this.addr_abs, this.reg["Y"].value);
                break;

            case "TAX":
                this.reg["X"].value = this.reg["A"].value;

                this.setFlag("Z", (!this.reg["X"].value));
                this.setFlag("N", this.reg["X"].value & 0x80);
                break;

            case "TAY":
                this.reg["Y"].value = this.reg["A"].value;

                this.setFlag("Z", (!this.reg["Y"].value));
                this.setFlag("N", this.reg["Y"].value & 0x80);
                break;

            case "TSX":
                this.reg["X"].value = this.stkp;

                this.setFlag("Z", (!this.reg["X"].value));
                this.setFlag("N", this.reg["X"].value & 0x80);
                break;

            case "TXA":
                this.reg["A"].value = this.reg["X"].value;

                this.setFlag("Z", (!this.reg["A"].value));
                this.setFlag("N", this.reg["A"].value & 0x80);
                break;

            case "TXS":
                this.stkp = this.reg["X"].value;
                break;

            case "TYA":
                this.reg["A"].value = this.reg["Y"].value;

                this.setFlag("Z", (!this.reg["A"].value));
                this.setFlag("N", this.reg["A"].value & 0x80);
                break;
        }

        return extraCycles;
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

        // TODO: catch toString of undefined exception (reading past code size)
        // TODO: implement "IND" prettifying
        while (addr <= stop) {
            let addrString = Utils.padNumber((addr).toString(16), 4);
            if (prettify) disasm += "<span id=\"S" + addrString + "\">"

            let op = CPU_6502_OPCODES.find(opcode => opcode.code == this.read(addr));
            if (op == undefined) { addr++; continue; }

            if (prettify) disasm += "<span class=hex-value-index>$" + addrString + "</span>: ";

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
                    if (prettify) disasm += " <span class=hex-value-immediate>";
                    disasm += " #$" + Utils.padNumber(lo, 2);
                    if (prettify) disasm += " </span>";

                    break;

                case "ZP0":
                    if (prettify) disasm += " <span class=hex-value>";
                    disasm += " $" + Utils.padNumber(lo, 2);
                    if (prettify) disasm += " </span>";
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
                    disasm += " $" + Utils.padNumber(hi, 2) + Utils.padNumber(lo, 2);
                    if (prettify) disasm += " </span>";

                    break;

                case "ABX":
                    hi = this.read(addr).toString(16); addr++;
                    if (prettify) disasm += " <span class=hex-value>";
                    disasm += " $" + Utils.padNumber(hi, 2) + Utils.padNumber(lo, 2);
                    if (prettify) disasm += "</span>, <span class=register>X</span>";
                    else disasm += ", X";

                    break;

                case "ABY":
                    hi = this.read(addr).toString(16); addr++;
                    if (prettify) disasm += " <span class=hex-value>";
                    disasm += " $" + Utils.padNumber(hi, 2) + Utils.padNumber(lo, 2);
                    if (prettify) disasm += "</span>, <span class=register>Y</span>";
                    else disasm += ", X";

                    break;

                case "IND":
                    hi = this.read(addr).toString(16); addr++;
                    disasm += " ($" + Utils.padNumber(hi, 2) + Utils.padNumber(lo, 2); + ")";
                    break;

                case "REL":
                    let reladdr = Utils.padNumber((addr + Utils.toSigned(parseInt(lo, 16), 8)).toString(16), 4);
                    let anchor = " <a href=# onclick=\"document.getElementById('S" + reladdr + "').classList.add('highlight');\">";
                    if (prettify) disasm += anchor + "<span class=hex-value-relative>[$" + reladdr + "]</span></a>";
                    else disasm += " [$" + Utils.padNumber((addr + Utils.toSigned(parseInt(lo, 16), 8)).toString(16), 4) + "]";
                    break;
            }
            if (!op.legal) {
                disasm += " (ILLEGAL)";
            }

            disasm += "</span><br>";
        }

        return disasm;
    }
}

export { CPU_6502 };