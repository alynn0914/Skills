@ECHO off

echo This script will help set up your Alexa workspace with your local GIT repositories

set /P continue= Press enter key to continue

set gitcoredir="C:\Alexa\bingo_alh"
set workspacedir="C:\Eclipse Neon\workspae\alexaNodeJs\Git\bingo_alh"

REM Link Java folders

ECHO Creating Symbolic Link between %workspacedir% and %gitcoredir%
mklink /D %workspacedir% %gitcoredir%

set /P exit= Press enter key to Exit

exit