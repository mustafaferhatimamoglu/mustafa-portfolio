@echo off
echo Yerel sunucu 5500 portunda baslatiliyor...
start http://localhost:5500
python -m http.server 5500
pause
