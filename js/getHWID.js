const { promisify } = require("node:util");
const Registry = require("winreg");

async function getHWID() {
  const regKey = new Registry({
    hive: Registry.HKLM,
    key: "\\SOFTWARE\\Microsoft\\Cryptography"
  });

  const getKey = promisify(regKey.get.bind(regKey));

  try {
    const key = await getKey("MachineGuid");
    return key.value.toLowerCase();
  } catch (error) {
    throw new Error("Failed to find HWID");
  }
}

module.exports = getHWID;