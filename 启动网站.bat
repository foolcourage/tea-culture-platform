chcp 65001
@echo off
:: 检查当前目录是否有 manage.py
if not exist "manage.py" (
    echo 错误：当前目录未找到 manage.py，请确保脚本放在Django项目根目录！
    pause
    exit /b
)

:: 启动Django开发服务器
echo 正在启动Django开发服务器...
python manage.py runserver

:: 如果用户按Ctrl+C终止，则关闭窗口
if errorlevel 1 (
    echo 服务器已停止。
    pause
)