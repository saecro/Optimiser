const child = require("child_process");

function checkModules() {
  try {
    child.execSync("npm list", { stdio: "inherit" });
    return true;
  } catch (e) {
    console.log(`Installing Modules\nPlease Wait...`);
    child.execSync(`npm i`, { stdio: "inherit" });
    return false;
  }
}

function fixModules() {
  let modulesChecked = false;
  while (!modulesChecked) {
    modulesChecked = checkModules();
  }
  return modulesChecked;
}

module.exports = fixModules;