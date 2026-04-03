@echo off
echo Yerel sunucu 5502 portunda baslatiliyor...
start http://localhost:5502
python -m http.server 5502
pause
