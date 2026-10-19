@echo off
REM ============================================================================
REM HYBRID LOGIC // End-of-Day Performance Telemetry Automation
REM Runs Monday-Friday at 16:30 EDT to aggregate forward trades and sync live website
REM ============================================================================

cd /d "c:\AI\AntiGravity\HybridLogicWebsite"
set PATH=C:\Program Files\nodejs;C:\Users\gjm64\AppData\Roaming\npm;C:\Users\gjm64\AppData\Local\Programs\Python\Python311;C:\Users\gjm64\AppData\Local\Programs\Python\Python311\Scripts;%PATH%

echo [%DATE% %TIME%] Starting daily performance telemetry update... >> "logs\daily_update.log"
"C:\Users\gjm64\AppData\Local\Programs\Python\Python311\python.exe" "scripts\update_daily_performance.py" >> "logs\daily_update.log" 2>&1
echo [%DATE% %TIME%] Completed daily performance telemetry update with exit code %ERRORLEVEL% >> "logs\daily_update.log"
