import { CPU_6502 } from "./CPU_6502.js";

class Bus {
    constructor(cpuClockSpeed) {
        this.cpu = new CPU_6502(cpuClockSpeed, this);
    }

    // Attached devices
    cpu;
    ram;


    // TODO: check whether value is in bounds

    // read(addr: 16-bit value)
    // returns: 8-bit value
    read(addr) {
        return this.ram[addr];
    }

    // write(addr: 16-bit value, data: 8-bit value)
    write(addr, data) {
        this.ram[addr] = data;
    }
    
}

export { Bus };