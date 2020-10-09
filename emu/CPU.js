import { Bus } from "./Bus.js";

class CPU {
    constructor() {
        if (this.constructor == CPU) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    bus;

    flags = [];    // Flags array

    r    = [];     // Register array + Status register
    stkp = 0x00;   // Stack pointer
    pc   = 0x0000; // Program counter
    clockSpeed;

    read(addr) {}
    write(addr, data) {}
    getInfo() {}
    disassemble(start, stop, prettify) {}
}

export { CPU }