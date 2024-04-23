const fs = require('fs');
const os = require('os');
const path = require('path');
const child_process = require('child_process');

// Function to empty a directory
// Function to empty a directory
function emptyDirectory(directory) {
    fs.readdir(directory, (err, files) => {
        if (err) {
            return;
        }

        for (const file of files) {
            const filePath = path.join(directory, file);
            try {
                fs.unlinkSync(filePath);
            } catch (error) {
            }
        }
    });
}

// Function to clear the recycle bin
function clearRecycleBin() {
    if (process.platform === 'win32') {
        child_process.exec('powershell.exe -Command "Clear-RecycleBin -Force"', (err, stdout, stderr) => {
            if (err) {
            } else {
            }
        });
    } else {
    }
}

// Clear downloads folder
const downloadsFolder = path.join(os.homedir(), 'Downloads');
emptyDirectory(downloadsFolder);

// Clear temp folders
const tempFolders = [os.tmpdir()];
tempFolders.forEach(emptyDirectory);

// Clear recycle bin
clearRecycleBin();
