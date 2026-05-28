const crypto = require("crypto");

function payfastEncode(value) {
  return encodeURIComponent(String(value).trim()).replace(/%20/g, "+");
}

function generatePayFastSignature(data, passphrase = "") {
  const pfOutput = {};

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (
      value !== null &&
      value !== undefined &&
      value !== "" &&
      key !== "signature"
    ) {
      pfOutput[key] = String(value).trim();
    }
  });

  let queryString = Object.keys(pfOutput)
    .map((key) => `${key}=${payfastEncode(pfOutput[key])}`)
    .join("&");

  if (passphrase && passphrase.trim() !== "") {
    queryString += `&passphrase=${payfastEncode(passphrase.trim())}`;
  }

  return crypto
    .createHash("md5")
    .update(queryString)
    .digest("hex")
    .toLowerCase();
}

module.exports = {
  generatePayFastSignature,
  payfastEncode,
};
