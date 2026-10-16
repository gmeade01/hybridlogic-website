@echo off
echo Starting Hybrid Logic Local Preview Server...
start http://localhost:3000
python -m http.server 3000 --directory "%~dp0"
