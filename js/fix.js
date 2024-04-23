const child = require("child_process");

//Check for missing modules
function checkModules() {
	try {
		child.execSync("npm list", { stdio: "ignore" });
		return true;
	} catch (e) {
		console.log(`Installing Modules\nPlease Wait...`);
		child.execSync(`npm i`, { stdio: "ignore" });
	}
	return false;
}
let modulesChecked = false;
while (!modulesChecked) {
	modulesChecked = checkModules();
}
