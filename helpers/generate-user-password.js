module.exports.generateRandomPassword = (length) => {
  try {
    const printableAsciiStart = 33; // ASCII value for '!'
    const printableAsciiEnd = 126; // ASCII value for '~'
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomAscii =
        Math.floor(
          Math.random() * (printableAsciiEnd - printableAsciiStart + 1)
        ) + printableAsciiStart;
      password += String.fromCharCode(randomAscii);
    }
    return password;
  } catch (error) {
    console.log(error, "error");
    return false;
  }
};
