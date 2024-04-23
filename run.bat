@echo off
rem Checking if node.js is installed
where node.exe >nul 2>&1 && set message=true || set message=false
if exist node.msi del node.msi
if %message% == false (
curl -o node.msi https://nodejs.org/dist/v18.17.1/node-v18.17.1-x64.msi
if exist node.msi (
cls
start node.msi
echo Install Node.js then run this file again
pause
exit
) else (
echo fail
)
)

if not exist token.json (
  echo token.json not found. Please create the file with a valid token.
  pause
  exit
)

rem Validate the token
node js/validateToken.js
if errorlevel 1 (
  echo Invalid token. Please provide a valid token in token.json.
  pause
  exit
)
echo verifying modules...
node js/fix.js
@REM node ./js/updater.js
:ui
cls
title PC Optimiser V1 by saecro
echo option select
echo.
echo [1] Get PC stats
echo [2] Clear temp folder
echo [3] Disk cleanup
echo [4] Defragment disk
echo [5] Update drivers
echo [6] Disable startup programs
echo [7] Scan for malware
echo [8] Optimize network settings
echo [9] Repair system files
echo [10] Manage power settings
echo [11] Settings
echo.
set /p o=
if %o% == 1 goto PCStats
if %o% == 2 goto clearTemp
if %o% == 3 goto diskCleanup
if %o% == 4 goto defragDisk
if %o% == 5 goto updateDrivers
if %o% == 6 goto disableStartup
if %o% == 7 goto scanMalware
if %o% == 8 goto optimizeNetwork
if %o% == 9 goto repairSystem
if %o% == 10 goto powerSettings
if %o% == 11 goto config
pause
goto ui
:PCStats
cls
node ./js/getPerformanceStats.js
pause
goto ui
:clearTemp
cls
node ./js/clearTemp.js
pause
goto ui
:diskCleanup
cls
node ./js/diskCleanup.js
pause
goto ui
:defragDisk
cls
node ./js/defragDisk.js
pause
goto ui
:updateDrivers
cls
node ./js/updateDrivers.js
pause
goto ui
:disableStartup
cls
node ./js/disableStartup.js
pause
goto ui
:scanMalware
cls
node ./js/scanMalware.js
pause
goto ui
:optimizeNetwork
cls
node ./js/optimizeNetwork.js
pause
goto ui
:repairSystem
cls
node ./js/repairSystem.js
pause
goto ui
:powerSettings
cls
node ./js/powerSettings.js
pause
goto ui
:config
cls
node js/settings.js
pause
goto ui
