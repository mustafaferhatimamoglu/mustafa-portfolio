@echo off
echo Yerel sunucu 5503 portunda baslatiliyor...
start http://localhost:5503
python -m http.server 5503
pause
