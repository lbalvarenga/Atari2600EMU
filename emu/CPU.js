import { Bus } from "./Bus.js";

class CPU {
    constructor() {
        if (this.constructor == CPU) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    bus;

    flags = [];    // Flags object array

    reg  = [];     // Registers object array + Status register
    stkp = 0x00;   // Stack pointer
    pc   = 0x0000; // Program counter
    clockSpeed;
    fetched = 0x00;

    addr_abs = 0x0000;
    addr_rel = 0x00;
    op       = [];
    cycles   = 0;

    read(addr) {}
    write(addr, data) {}

    clock() {}
    reset() {}

    getFlag() {}
    setFlag() {}
    handleAddrMode() {}
    handleOp() {}

    getInfo() {}
    disassemble(start, stop, prettify) {}
}

export { CPU }