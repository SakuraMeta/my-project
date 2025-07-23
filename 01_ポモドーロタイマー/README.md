# ポモドーロタイマー

Pythonとtkinterで作成したGUIポモドーロタイマーアプリケーションです。

## 機能

- **25分作業セッション** - 集中して作業を行う
- **5分短休憩** - 短い休憩でリフレッシュ
- **15分長休憩** - 4セッション後の長めの休憩
- **セッション管理** - 現在のセッション数を表示
- **タイマー制御** - 開始/一時停止/リセット/次へボタン
- **設定変更** - 作業時間と休憩時間をカスタマイズ可能
- **通知機能** - セッション終了時にポップアップ通知

## 使用方法

### Pythonから実行
```bash
python pomodoro_timer.py
```

### exe形式で実行
`dist`フォルダ内の`ポモドーロタイマー.exe`をダブルクリックして実行

## ファイル構成

- `pomodoro_timer.py` - メインアプリケーションファイル
- `dist/ポモドーロタイマー.exe` - 実行可能ファイル（PyInstallerでビルド）
- `README.md` - このファイル

## 必要な環境

- Python 3.x
- tkinter（通常Pythonに標準で含まれています）

## ビルド方法

exe形式のファイルを作成する場合：

```bash
pip install pyinstaller
python -m PyInstaller --onefile --windowed --name "ポモドーロタイマー" pomodoro_timer.py
```

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。
