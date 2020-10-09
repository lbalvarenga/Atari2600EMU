class Utils {
    static padNumber(numberString, padding) {
        while (numberString.length < padding) {
            numberString = "0" + numberString;
        }

        return numberString;
    }

    static toSigned(number, width) {
        let max = Math.pow(2, width) - 1;
        if (number > max / 2) {
            number -= max + 1;
        }

        return number;
    }
}

export { Utils };