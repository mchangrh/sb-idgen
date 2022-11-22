// https://github.com/ajayyy/SponsorBlock/blob/master/src/utils/genericUtils.ts#L132
function generateUserID() {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 36;
  let result = "";
  if (window.crypto && window.crypto.getRandomValues) {
    const values = new Uint32Array(length);
    window.crypto.getRandomValues(values);
    for (let i = 0; i < length; i++) {
      result += charset[values[i] % charset.length];
    }
    return result;
  } else {
    for (let i = 0; i < length; i++) {
      result += charset[Math.floor(Math.random() * charset.length)];
    }
    return result;
  }
}

async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8)
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // bytes to hex string
  return hashHex;
}

async function multiHash(input, times = 5000) {
  for (let i = 0; i < times; i++) {
    input = await digestMessage(input);
  }
  return input;
}

function generateBlob(privateID, publicID) {
  const blob = new Blob(["SponsorBlock Private UserID Backup",
  "\n\n",
  "The Public ID can be shared with others to allow them to look up your submissions. Share freely.",
  "\n\n",
  "Public ID (can be shared):",
  "\n\n\t",
  publicID,
  "\n\n",
  "The Private ID is used to identify you when submitting segments. Do not share this.",
  "\n\n",
  "Private ID (keep this secret):",
  "\n\n\t",
  privateID,
  "\n"
  ], {type: 'text/plain'});
  const link = document.querySelector("#blob-download")
  link.href = URL.createObjectURL(blob);
}