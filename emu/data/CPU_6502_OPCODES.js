// based on opcode matrix from datasheet

const CPU_6502_OPCODES = [
    // Row 0
    {
        code: 0x00,
        name: "BRK",
        mode: "IMM",
        cycles: 7,
        legal: true
    },
    {
        code: 0x01,
        name: "ORA",
        mode: "IZX",
        cycles: 6,
        legal: true
    },
    {
        code: 0x02,
        name: "XXX",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0x03,
        name: "XXX",
        mode: "IMP",
        cycles: 8,
        legal: false
    },
    {
        code: 0x04,
        name: "NOP",
        mode: "IMP",
        cycles: 3,
        legal: false
    },
    {
        code: 0x05,
        name: "ORA",
        mode: "ZP0",
        cycles: 3,
        legal: true
    },
    {
        code: 0x06,
        name: "ASL",
        mode: "ZP0",
        cycles: 5,
        legal: true
    },
    {
        code: 0x07,
        name: "XXX",
        mode: "IMP",
        cycles: 5,
        legal: false
    },
    {
        code: 0x08,
        name: "PHP",
        mode: "IMP",
        cycles: 3,
        legal: true
    },
    {
        code: 0x09,
        name: "ORA",
        mode: "IMM",
        cycles: 2,
        legal: true
    },
    {
        code: 0x0A,
        name: "ASL",
        mode: "IMP",
        cycles: 2,
        legal: true
    },
    {
        code: 0x0B,
        name: "XXX",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0x0C,
        name: "NOP",
        mode: "IMP",
        cycles: 4,
        legal: false
    },
    {
        code: 0x0D,
        name: "ORA",
        mode: "ABS",
        cycles: 4,
        legal: true
    },
    {
        code: 0x0E,
        name: "ASL",
        mode: "ABS",
        cycles: 6,
        legal: true
    },
    {
        code: 0x0F,
        name: "XXX",
        mode: "IMP",
        cycles: 6,
        legal: false
    },

    // Row 1
    {
        code: 0x10,
        name: "BPL",
        mode: "REL",
        cycles: 2,
        legal: true
    },
    {
        code: 0x11,
        name: "ORA",
        mode: "IZY",
        cycles: 5,
        legal: true
    },
    {
        code: 0x12,
        name: "XXX",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0x13,
        name: "XXX",
        mode: "IMP",
        cycles: 8,
        legal: false
    },
    {
        code: 0x14,
        name: "NOP",
        mode: "IMP",
        cycles: 4,
        legal: false
    },
    {
        code: 0x15,
        name: "ORA",
        mode: "ZPX",
        cycles: 4,
        legal: true
    },
    {
        code: 0x16,
        name: "ASL",
        mode: "ZPX",
        cycles: 6,
        legal: true
    },
    {
        code: 0x17,
        name: "XXX",
        mode: "IMP",
        cycles: 6,
        legal: false
    },
    {
        code: 0x18,
        name: "CLC",
        mode: "IMP",
        cycles: 2,
        legal: true
    },
    {
        code: 0x19,
        name: "ORA",
        mode: "ABY",
        cycles: 4,
        legal: true
    },
    {
        code: 0x1A,
        name: "NOP",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0x1B,
        name: "XXX",
        mode: "IMP",
        cycles: 7,
        legal: false
    },
    {
        code: 0x1C,
        name: "NOP",
        mode: "IMP",
        cycles: 4,
        legal: false
    },
    {
        code: 0x1D,
        name: "ORA",
        mode: "ABX",
        cycles: 4,
        legal: true
    },
    {
        code: 0x1E,
        name: "ASL",
        mode: "ABX",
        cycles: 7,
        legal: true
    },
    {
        code: 0x1F,
        name: "XXX",
        mode: "IMP",
        cycles: 7,
        legal: false
    },

    // Row 2
    {
        code: 0x20,
        name: "JSR",
        mode: "ABS",
        cycles: 6,
        legal: true
    },
    {
        code: 0x21,
        name: "AND",
        mode: "IZX",
        cycles: 6,
        legal: true
    },
    {
        code: 0x22,
        name: "XXX",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0x23,
        name: "XXX",
        mode: "IMP",
        cycles: 8,
        legal: false
    },
    {
        code: 0x24,
        name: "BIT",
        mode: "ZP0",
        cycles: 3,
        legal: true
    },
    {
        code: 0x25,
        name: "AND",
        mode: "ZP0",
        cycles: 3,
        legal: true
    },
    {
        code: 0x26,
        name: "ROL",
        mode: "ZP0",
        cycles: 5,
        legal: true
    },
    {
        code: 0x27,
        name: "XXX",
        mode: "IMP",
        cycles: 5,
        legal: false
    },
    {
        code: 0x28,
        name: "PLP",
        mode: "IMP",
        cycles: 4,
        legal: true
    },
    {
        code: 0x29,
        name: "AND",
        mode: "IMM",
        cycles: 2,
        legal: true
    },
    {
        code: 0x2A,
        name: "ROL",
        mode: "IMP",
        cycles: 2,
        legal: true
    },
    {
        code: 0x2B,
        name: "XXX",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0x2C,
        name: "BIT",
        mode: "ABS",
        cycles: 4,
        legal: true
    },
    {
        code: 0x2D,
        name: "AND",
        mode: "ABS",
        cycles: 4,
        legal: true
    },
    {
        code: 0x2E,
        name: "ROL",
        mode: "ABS",
        cycles: 6,
        legal: true
    },
    {
        code: 0x2F,
        name: "XXX",
        mode: "IMP",
        cycles: 6,
        legal: false
    },

    // Row 3
    {
        code: 0x30,
        name: "BMI",
        mode: "REL",
        cycles: 2,
        legal: true
    },
    {
        code: 0x31,
        name: "AND",
        mode: "IZY",
        cycles: 5,
        legal: true
    },
    {
        code: 0x32,
        name: "XXX",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0x33,
        name: "XXX",
        mode: "IMP",
        cycles: 8,
        legal: false
    },
    {
        code: 0x34,
        name: "NOP",
        mode: "IMP",
        cycles: 4,
        legal: false
    },
    {
        code: 0x35,
        name: "AND",
        mode: "ZPX",
        cycles: 4,
        legal: true
    },
    {
        code: 0x36,
        name: "ROL",
        mode: "ZPX",
        cycles: 6,
        legal: true
    },
    {
        code: 0x37,
        name: "XXX",
        mode: "IMP",
        cycles: 6,
        legal: false
    },
    {
        code: 0x38,
        name: "SEC",
        mode: "IMP",
        cycles: 2,
        legal: true
    },
    {
        code: 0x39,
        name: "AND",
        mode: "ABY",
        cycles: 4,
        legal: true
    },
    {
        code: 0x3A,
        name: "NOP",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0x3B,
        name: "XXX",
        mode: "IMP",
        cycles: 7,
        legal: false
    },
    {
        code: 0x3C,
        name: "NOP",
        mode: "IMP",
        cycles: 4,
        legal: false
    },
    {
        code: 0x3D,
        name: "AND",
        mode: "ABX",
        cycles: 4,
        legal: true
    },
    {
        code: 0x3E,
        name: "ROL",
        mode: "ABX",
        cycles: 7,
        legal: true
    },
    {
        code: 0x3F,
        name: "XXX",
        mode: "IMP",
        cycles: 7,
        legal: false
    },

    // Row 4
    {
        code: 0x40,
        name: "RTI",
        mode: "IMP",
        cycles: 6,
        legal: true
    },
    {
        code: 0x41,
        name: "EOR",
        mode: "IZX",
        cycles: 6,
        legal: true
    },
    {
        code: 0x42,
        name: "XXX",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0x43,
        name: "XXX",
        mode: "IMP",
        cycles: 8,
        legal: false
    },
    {
        code: 0x44,
        name: "NOP",
        mode: "IMP",
        cycles: 3,
        legal: false
    },
    {
        code: 0x45,
        name: "EOR",
        mode: "ZP0",
        cycles: 3,
        legal: true
    },
    {
        code: 0x46,
        name: "LSR",
        mode: "ZP0",
        cycles: 5,
        legal: true
    },
    {
        code: 0x47,
        name: "XXX",
        mode: "IMP",
        cycles: 5,
        legal: false
    },
    {
        code: 0x48,
        name: "PHA",
        mode: "IMP",
        cycles: 3,
        legal: true
    },
    {
        code: 0x49,
        name: "EOR",
        mode: "IMM",
        cycles: 2,
        legal: true
    },
    {
        code: 0x4A,
        name: "LSR",
        mode: "IMP",
        cycles: 2,
        legal: true
    },
    {
        code: 0x4B,
        name: "XXX",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0x4C,
        name: "JMP",
        mode: "ABS",
        cycles: 3,
        legal: true
    },
    {
        code: 0x4D,
        name: "EOR",
        mode: "ABS",
        cycles: 4,
        legal: true
    },
    {
        code: 0x4E,
        name: "LSR",
        mode: "ABS",
        cycles: 6,
        legal: true
    },
    {
        code: 0x4F,
        name: "XXX",
        mode: "IMP",
        cycles: 6,
        legal: false
    },

    // Row 5
    {
        code: 0x50,
        name: "BVC",
        mode: "REL",
        cycles: 2,
        legal: true
    },
    {
        code: 0x51,
        name: "EOR",
        mode: "IZY",
        cycles: 5,
        legal: true
    },
    {
        code: 0x52,
        name: "XXX",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0x53,
        name: "XXX",
        mode: "IMP",
        cycles: 8,
        legal: false
    },
    {
        code: 0x54,
        name: "NOP",
        mode: "IMP",
        cycles: 4,
        legal: false
    },
    {
        code: 0x55,
        name: "EOR",
        mode: "ZPX",
        cycles: 4,
        legal: true
    },
    {
        code: 0x56,
        name: "LSR",
        mode: "ZPX",
        cycles: 6,
        legal: true
    },
    {
        code: 0x57,
        name: "XXX",
        mode: "IMP",
        cycles: 6,
        legal: false
    },
    {
        code: 0x58,
        name: "CLI",
        mode: "IMP",
        cycles: 2,
        legal: true
    },
    {
        code: 0x59,
        name: "EOR",
        mode: "ABY",
        cycles: 4,
        legal: true
    },
    {
        code: 0x5A,
        name: "NOP",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0x5B,
        name: "XXX",
        mode: "IMP",
        cycles: 7,
        legal: false
    },
    {
        code: 0x5C,
        name: "NOP",
        mode: "IMP",
        cycles: 4,
        legal: false
    },
    {
        code: 0x5D,
        name: "EOR",
        mode: "ABX",
        cycles: 4,
        legal: true
    },
    {
        code: 0x5E,
        name: "LSR",
        mode: "ABX",
        cycles: 7,
        legal: true
    },
    {
        code: 0x5F,
        name: "XXX",
        mode: "IMP",
        cycles: 7,
        legal: false
    },

    // Row 6
    {
        code: 0x60,
        name: "RTS",
        mode: "IMP",
        cycles: 6,
        legal: true
    },
    {
        code: 0x61,
        name: "ADC",
        mode: "IZX",
        cycles: 6,
        legal: true
    },
    {
        code: 0x62,
        name: "XXX",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0x63,
        name: "XXX",
        mode: "IMP",
        cycles: 8,
        legal: false
    },
    {
        code: 0x64,
        name: "NOP",
        mode: "IMP",
        cycles: 3,
        legal: false
    },
    {
        code: 0x65,
        name: "ADC",
        mode: "ZP0",
        cycles: 5,
        legal: true
    },
    {
        code: 0x66,
        name: "ROR",
        mode: "ZP0",
        cycles: 5,
        legal: true
    },
    {
        code: 0x67,
        name: "XXX",
        mode: "IMP",
        cycles: 5,
        legal: false
    },
    {
        code: 0x68,
        name: "PLA",
        mode: "IMP",
        cycles: 4,
        legal: true
    },
    {
        code: 0x69,
        name: "ADC",
        mode: "IMM",
        cycles: 2,
        legal: true
    },
    {
        code: 0x6A,
        name: "ROR",
        mode: "IMP",
        cycles: 2,
        legal: true
    },
    {
        code: 0x6B,
        name: "XXX",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0x6C,
        name: "JMP",
        mode: "IND",
        cycles: 5,
        legal: true
    },
    {
        code: 0x6D,
        name: "ADC",
        mode: "ABS",
        cycles: 4,
        legal: true
    },
    {
        code: 0x6E,
        name: "ROR",
        mode: "ABS",
        cycles: 6,
        legal: true
    },
    {
        code: 0x6F,
        name: "XXX",
        mode: "IMP",
        cycles: 6,
        legal: false
    },

    // Row 7
    {
        code: 0x70,
        name: "BVS",
        mode: "REL",
        cycles: 2,
        legal: true
    },
    {
        code: 0x71,
        name: "ADC",
        mode: "IZY",
        cycles: 5,
        legal: true
    },
    {
        code: 0x72,
        name: "XXX",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0x73,
        name: "XXX",
        mode: "IMP",
        cycles: 8,
        legal: false
    },
    {
        code: 0x74,
        name: "NOP",
        mode: "IMP",
        cycles: 4,
        legal: false
    },
    {
        code: 0x75,
        name: "ADC",
        mode: "ZPX",
        cycles: 4,
        legal: true
    },
    {
        code: 0x76,
        name: "ROR",
        mode: "ZPX",
        cycles: 6,
        legal: true
    },
    {
        code: 0x77,
        name: "XXX",
        mode: "IMP",
        cycles: 6,
        legal: false
    },
    {
        code: 0x78,
        name: "SEI",
        mode: "IMP",
        cycles: 2,
        legal: true
    },
    {
        code: 0x79,
        name: "ADC",
        mode: "ABY",
        cycles: 4,
        legal: true
    },
    {
        code: 0x7A,
        name: "NOP",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0x7B,
        name: "XXX",
        mode: "IMP",
        cycles: 7,
        legal: false
    },
    {
        code: 0x7C,
        name: "NOP",
        mode: "IMP",
        cycles: 4,
        legal: false
    },
    {
        code: 0x7D,
        name: "ADC",
        mode: "ABX",
        cycles: 4,
        legal: true
    },
    {
        code: 0x7E,
        name: "ROR",
        mode: "ABX",
        cycles: 7,
        legal: true
    },
    {
        code: 0x7F,
        name: "XXX",
        mode: "IMP",
        cycles: 7,
        legal: false
    },

    // Row 8
    {
        code: 0x80,
        name: "NOP",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0x81,
        name: "STA",
        mode: "IZX",
        cycles: 6,
        legal: true
    },
    {
        code: 0x82,
        name: "NOP",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0x83,
        name: "XXX",
        mode: "IMP",
        cycles: 6,
        legal: false
    },
    {
        code: 0x84,
        name: "STY",
        mode: "ZP0",
        cycles: 3,
        legal: true
    },
    {
        code: 0x85,
        name: "STA",
        mode: "ZP0",
        cycles: 3,
        legal: true
    },
    {
        code: 0x86,
        name: "STX",
        mode: "ZP0",
        cycles: 3,
        legal: true
    },
    {
        code: 0x87,
        name: "XXX",
        mode: "IMP",
        cycles: 3,
        legal: false
    },
    {
        code: 0x88,
        name: "DEI",
        mode: "IMP",
        cycles: 2,
        legal: true
    },
    {
        code: 0x89,
        name: "NOP",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0x8A,
        name: "TXA",
        mode: "IMP",
        cycles: 2,
        legal: true
    },
    {
        code: 0x8B,
        name: "XXX",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0x8C,
        name: "STY",
        mode: "ABS",
        cycles: 4,
        legal: true
    },
    {
        code: 0x8D,
        name: "STA",
        mode: "ABS",
        cycles: 4,
        legal: true
    },
    {
        code: 0x8E,
        name: "STX",
        mode: "ABS",
        cycles: 4,
        legal: true
    },
    {
        code: 0x8F,
        name: "XXX",
        mode: "IMP",
        cycles: 4,
        legal: false
    },

    // Row 9
    {
        code: 0x90,
        name: "BCC",
        mode: "REL",
        cycles: 2,
        legal: true
    },
    {
        code: 0x91,
        name: "STA",
        mode: "IZY",
        cycles: 6,
        legal: true
    },
    {
        code: 0x92,
        name: "XXX",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0x93,
        name: "XXX",
        mode: "IMP",
        cycles: 6,
        legal: false
    },
    {
        code: 0x94,
        name: "STY",
        mode: "ZPX",
        cycles: 4,
        legal: true
    },
    {
        code: 0x95,
        name: "STA",
        mode: "ZPX",
        cycles: 4,
        legal: true
    },
    {
        code: 0x96,
        name: "STX",
        mode: "ZPY",
        cycles: 4,
        legal: true
    },
    {
        code: 0x97,
        name: "XXX",
        mode: "IMP",
        cycles: 4,
        legal: false
    },
    {
        code: 0x98,
        name: "TYA",
        mode: "IMP",
        cycles: 2,
        legal: true
    },
    {
        code: 0x99,
        name: "STA",
        mode: "ABY",
        cycles: 5,
        legal: true
    },
    {
        code: 0x9A,
        name: "TXS",
        mode: "IMP",
        cycles: 2,
        legal: true
    },
    {
        code: 0x9B,
        name: "XXX",
        mode: "IMP",
        cycles: 5,
        legal: false
    },
    {
        code: 0x9C,
        name: "NOP",
        mode: "IMP",
        cycles: 5,
        legal: true
    },
    {
        code: 0x9D,
        name: "STA",
        mode: "ABX",
        cycles: 5,
        legal: true
    },
    {
        code: 0x9E,
        name: "XXX",
        mode: "IMP",
        cycles: 5,
        legal: false
    },
    {
        code: 0x9F,
        name: "XXX",
        mode: "IMP",
        cycles: 5,
        legal: false
    },

    // Row A
    {
        code: 0xA0,
        name: "LDY",
        mode: "IMM",
        cycles: 2,
        legal: true
    },
    {
        code: 0xA1,
        name: "LDA",
        mode: "IZX",
        cycles: 6,
        legal: true
    },
    {
        code: 0xA2,
        name: "LDX",
        mode: "IMM",
        cycles: 2,
        legal: true
    },
    {
        code: 0xA3,
        name: "XXX",
        mode: "IMP",
        cycles: 6,
        legal: false
    },
    {
        code: 0xA4,
        name: "LDY",
        mode: "ZP0",
        cycles: 3,
        legal: true
    },
    {
        code: 0xA5,
        name: "LDA",
        mode: "ZP0",
        cycles: 3,
        legal: true
    },
    {
        code: 0xA6,
        name: "LDX",
        mode: "ZP0",
        cycles: 3,
        legal: true
    },
    {
        code: 0xA7,
        name: "XXX",
        mode: "IMP",
        cycles: 3,
        legal: false
    },
    {
        code: 0xA8,
        name: "TAY",
        mode: "IMP",
        cycles: 2,
        legal: true
    },
    {
        code: 0xA9,
        name: "LDA",
        mode: "IMM",
        cycles: 2,
        legal: true
    },
    {
        code: 0xAA,
        name: "TAX",
        mode: "IMP",
        cycles: 2,
        legal: true
    },
    {
        code: 0xAB,
        name: "XXX",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0xAC,
        name: "LDY",
        mode: "ABS",
        cycles: 4,
        legal: true
    },
    {
        code: 0xAD,
        name: "LDA",
        mode: "ABS",
        cycles: 4,
        legal: true
    },
    {
        code: 0xAE,
        name: "LDX",
        mode: "ABS",
        cycles: 4,
        legal: true
    },
    {
        code: 0xAF,
        name: "XXX",
        mode: "IMP",
        cycles: 4,
        legal: false
    },

    // Row B
    {
        code: 0xB0,
        name: "BCS",
        mode: "REL",
        cycles: 2,
        legal: true
    },
    {
        code: 0xB1,
        name: "LDA",
        mode: "IZY",
        cycles: 5,
        legal: true
    },
    {
        code: 0xB2,
        name: "XXX",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0xB3,
        name: "XXX",
        mode: "IMP",
        cycles: 5,
        legal: false
    },
    {
        code: 0xB4,
        name: "LDY",
        mode: "ZPX",
        cycles: 4,
        legal: true
    },
    {
        code: 0xB5,
        name: "LDA",
        mode: "ZPX",
        cycles: 4,
        legal: true
    },
    {
        code: 0xB6,
        name: "LDX",
        mode: "ZPY",
        cycles: 4,
        legal: true
    },
    {
        code: 0xB7,
        name: "XXX",
        mode: "IMP",
        cycles: 4,
        legal: false
    },
    {
        code: 0xB8,
        name: "CLV",
        mode: "IMP",
        cycles: 2,
        legal: true
    },
    {
        code: 0xB9,
        name: "LDA",
        mode: "ABY",
        cycles: 4,
        legal: true
    },
    {
        code: 0xBA,
        name: "TSX",
        mode: "IMP",
        cycles: 2,
        legal: true
    },
    {
        code: 0xBB,
        name: "XXX",
        mode: "IMP",
        cycles: 4,
        legal: false
    },
    {
        code: 0xBC,
        name: "LDY",
        mode: "ABX",
        cycles: 4,
        legal: true
    },
    {
        code: 0xBD,
        name: "LDA",
        mode: "ABX",
        cycles: 4,
        legal: true
    },
    {
        code: 0xBE,
        name: "LDX",
        mode: "ABY",
        cycles: 4,
        legal: true
    },
    {
        code: 0xBF,
        name: "XXX",
        mode: "IMP",
        cycles: 4,
        legal: false
    },

    // Row C
    {
        code: 0xC0,
        name: "CPY",
        mode: "IMM",
        cycles: 2,
        legal: true
    },
    {
        code: 0xC1,
        name: "CMP",
        mode: "IZX",
        cycles: 6,
        legal: true
    },
    {
        code: 0xC2,
        name: "NOP",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0xC3,
        name: "XXX",
        mode: "IMP",
        cycles: 8,
        legal: false
    },
    {
        code: 0xC4,
        name: "CPY",
        mode: "ZP0",
        cycles: 3,
        legal: true
    },
    {
        code: 0xC5,
        name: "CMP",
        mode: "ZP0",
        cycles: 3,
        legal: true
    },
    {
        code: 0xC6,
        name: "DEC",
        mode: "ZP0",
        cycles: 5,
        legal: true
    },
    {
        code: 0xC7,
        name: "XXX",
        mode: "IMP",
        cycles: 5,
        legal: false
    },
    {
        code: 0xC8,
        name: "INY",
        mode: "IMP",
        cycles: 2,
        legal: true
    },
    {
        code: 0xC9,
        name: "CMP",
        mode: "IMM",
        cycles: 2,
        legal: true
    },
    {
        code: 0xCA,
        name: "DEX",
        mode: "IMP",
        cycles: 2,
        legal: true
    },
    {
        code: 0xCB,
        name: "XXX",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0xCC,
        name: "CPY",
        mode: "ABS",
        cycles: 4,
        legal: true
    },
    {
        code: 0xCD,
        name: "CMP",
        mode: "ABS",
        cycles: 4,
        legal: true
    },
    {
        code: 0xCE,
        name: "DEC",
        mode: "ABS",
        cycles: 6,
        legal: true
    },
    {
        code: 0xCF,
        name: "XXX",
        mode: "IMP",
        cycles: 6,
        legal: false
    },

    // Row D
    {
        code: 0xD0,
        name: "BNE",
        mode: "REL",
        cycles: 2,
        legal: true
    },
    {
        code: 0xD1,
        name: "CMP",
        mode: "IZY",
        cycles: 5,
        legal: true
    },
    {
        code: 0xD2,
        name: "XXX",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0xD3,
        name: "XXX",
        mode: "IMP",
        cycles: 8,
        legal: false
    },
    {
        code: 0xD4,
        name: "NOP",
        mode: "IMP",
        cycles: 4,
        legal: false
    },
    {
        code: 0xD5,
        name: "CMP",
        mode: "ZPX",
        cycles: 4,
        legal: true
    },
    {
        code: 0xD6,
        name: "DEC",
        mode: "ZPX",
        cycles: 6,
        legal: true
    },
    {
        code: 0xD7,
        name: "XXX",
        mode: "IMP",
        cycles: 6,
        legal: false
    },
    {
        code: 0xD8,
        name: "CLD",
        mode: "IMP",
        cycles: 2,
        legal: true
    },
    {
        code: 0xD9,
        name: "CMP",
        mode: "ABY",
        cycles: 4,
        legal: true
    },
    {
        code: 0xDA,
        name: "NOP",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0xDB,
        name: "XXX",
        mode: "IMP",
        cycles: 7,
        legal: false
    },
    {
        code: 0xDC,
        name: "NOP",
        mode: "IMP",
        cycles: 4,
        legal: false
    },
    {
        code: 0xDD,
        name: "CMP",
        mode: "ABX",
        cycles: 4,
        legal: true
    },
    {
        code: 0xDE,
        name: "DEC",
        mode: "ABX",
        cycles: 7,
        legal: true
    },
    {
        code: 0xDF,
        name: "XXX",
        mode: "IMP",
        cycles: 7,
        legal: false
    },

    // Row E
    {
        code: 0xE0,
        name: "CPX",
        mode: "IMM",
        cycles: 2,
        legal: true
    },
    {
        code: 0xE1,
        name: "SBC",
        mode: "IZX",
        cycles: 6,
        legal: true
    },
    {
        code: 0xE2,
        name: "NOP",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0xE3,
        name: "XXX",
        mode: "IMP",
        cycles: 8,
        legal: false
    },
    {
        code: 0xE4,
        name: "CPX",
        mode: "ZP0",
        cycles: 3,
        legal: true
    },
    {
        code: 0xE5,
        name: "SBC",
        mode: "ZP0",
        cycles: 3,
        legal: true
    },
    {
        code: 0xE6,
        name: "INC",
        mode: "ZP0",
        cycles: 5,
        legal: true
    },
    {
        code: 0xE7,
        name: "XXX",
        mode: "IMP",
        cycles: 5,
        legal: false
    },
    {
        code: 0xE8,
        name: "INX",
        mode: "IMP",
        cycles: 2,
        legal: true
    },
    {
        code: 0xE9,
        name: "SBC",
        mode: "IMM",
        cycles: 2,
        legal: true
    },
    {
        code: 0xEA,
        name: "NOP",
        mode: "IMP",
        cycles: 2,
        legal: true
    },
    {
        code: 0xEB,
        name: "SBC",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0xEC,
        name: "CPX",
        mode: "ABS",
        cycles: 4,
        legal: true
    },
    {
        code: 0xED,
        name: "SBC",
        mode: "ABS",
        cycles: 4,
        legal: true
    },
    {
        code: 0xEE,
        name: "INC",
        mode: "ABS",
        cycles: 6,
        legal: true
    },
    {
        code: 0xEF,
        name: "XXX",
        mode: "IMP",
        cycles: 6,
        legal: false
    },

    // Row F
    {
        code: 0xF0,
        name: "BEQ",
        mode: "REL",
        cycles: 2,
        legal: true
    },
    {
        code: 0xF1,
        name: "SBC",
        mode: "IZY",
        cycles: 5,
        legal: true
    },
    {
        code: 0xF2,
        name: "XXX",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0xF3,
        name: "XXX",
        mode: "IMP",
        cycles: 8,
        legal: false
    },
    {
        code: 0xF4,
        name: "NOP",
        mode: "IMP",
        cycles: 4,
        legal: false
    },
    {
        code: 0xF5,
        name: "SBC",
        mode: "ZPX",
        cycles: 4,
        legal: true
    },
    {
        code: 0xF6,
        name: "INC",
        mode: "ZPX",
        cycles: 6,
        legal: true
    },
    {
        code: 0xF7,
        name: "XXX",
        mode: "IMP",
        cycles: 6,
        legal: false
    },
    {
        code: 0xF8,
        name: "SED",
        mode: "IMP",
        cycles: 2,
        legal: true
    },
    {
        code: 0xF9,
        name: "SBC",
        mode: "ABY",
        cycles: 4,
        legal: true
    },
    {
        code: 0xFA,
        name: "NOP",
        mode: "IMP",
        cycles: 2,
        legal: false
    },
    {
        code: 0xFB,
        name: "XXX",
        mode: "IMP",
        cycles: 7,
        legal: false
    },
    {
        code: 0xFC,
        name: "NOP",
        mode: "IMP",
        cycles: 4,
        legal: false
    },
    {
        code: 0xFD,
        name: "SBC",
        mode: "ABX",
        cycles: 4,
        legal: true
    },
    {
        code: 0xFE,
        name: "INC",
        mode: "ABX",
        cycles: 7,
        legal: true
    },
    {
        code: 0xFF,
        name: "XXX",
        mode: "IMP",
        cycles: 7,
        legal: false
    },
];

// Addressing modes:
// IMP (implied), IMM (immediate), ZP0 (zero page), ZPX (zero page x),
// ZPY (zero page y), REL (relative), ABS (absolute), ABX (absolute x),
// ABY (absolute y), IND (indirect), IZX (indirect x), IZY (indirect y)

export { CPU_6502_OPCODES };