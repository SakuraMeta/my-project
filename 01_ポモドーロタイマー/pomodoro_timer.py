import tkinter as tk
from tkinter import ttk, messagebox
import threading
import time
from datetime import datetime, timedelta

class PomodoroTimer:
    def __init__(self, root):
        self.root = root
        self.root.title("ポモドーロタイマー")
        self.root.geometry("400x300")
        self.root.resizable(False, False)
        
        # タイマー設定（分）
        self.work_time = 25
        self.short_break = 5
        self.long_break = 15
        self.sessions_until_long_break = 4
        
        # 状態管理
        self.current_session = 1
        self.is_running = False
        self.is_paused = False
        self.current_mode = "work"  # work, short_break, long_break
        self.remaining_time = self.work_time * 60
        self.timer_thread = None
        
        self.setup_ui()
        self.update_display()
        
    def setup_ui(self):
        # メインフレーム
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # タイトル
        title_label = ttk.Label(main_frame, text="ポモドーロタイマー", 
                               font=("Arial", 16, "bold"))
        title_label.grid(row=0, column=0, columnspan=3, pady=(0, 20))
        
        # 現在のモード表示
        self.mode_label = ttk.Label(main_frame, text="作業時間", 
                                   font=("Arial", 12))
        self.mode_label.grid(row=1, column=0, columnspan=3, pady=(0, 10))
        
        # タイマー表示
        self.time_label = ttk.Label(main_frame, text="25:00", 
                                   font=("Arial", 24, "bold"))
        self.time_label.grid(row=2, column=0, columnspan=3, pady=(0, 20))
        
        # セッション表示
        self.session_label = ttk.Label(main_frame, text="セッション: 1/4")
        self.session_label.grid(row=3, column=0, columnspan=3, pady=(0, 20))
        
        # ボタンフレーム
        button_frame = ttk.Frame(main_frame)
        button_frame.grid(row=4, column=0, columnspan=3, pady=(0, 20))
        
        # 開始/一時停止ボタン
        self.start_pause_btn = ttk.Button(button_frame, text="開始", 
                                         command=self.toggle_timer)
        self.start_pause_btn.grid(row=0, column=0, padx=(0, 10))
        
        # リセットボタン
        self.reset_btn = ttk.Button(button_frame, text="リセット", 
                                   command=self.reset_timer)
        self.reset_btn.grid(row=0, column=1, padx=(0, 10))
        
        # 次のセッションボタン
        self.next_btn = ttk.Button(button_frame, text="次へ", 
                                  command=self.next_session)
        self.next_btn.grid(row=0, column=2)
        
        # 設定フレーム
        settings_frame = ttk.LabelFrame(main_frame, text="設定", padding="10")
        settings_frame.grid(row=5, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(10, 0))
        
        # 作業時間設定
        ttk.Label(settings_frame, text="作業時間:").grid(row=0, column=0, sticky=tk.W)
        self.work_var = tk.StringVar(value=str(self.work_time))
        work_spinbox = ttk.Spinbox(settings_frame, from_=1, to=60, width=5, 
                                  textvariable=self.work_var, command=self.update_settings)
        work_spinbox.grid(row=0, column=1, padx=(5, 10))
        ttk.Label(settings_frame, text="分").grid(row=0, column=2, sticky=tk.W)
        
        # 短い休憩設定
        ttk.Label(settings_frame, text="短い休憩:").grid(row=0, column=3, sticky=tk.W, padx=(20, 0))
        self.short_var = tk.StringVar(value=str(self.short_break))
        short_spinbox = ttk.Spinbox(settings_frame, from_=1, to=30, width=5, 
                                   textvariable=self.short_var, command=self.update_settings)
        short_spinbox.grid(row=0, column=4, padx=(5, 10))
        ttk.Label(settings_frame, text="分").grid(row=0, column=5, sticky=tk.W)
        
    def update_settings(self):
        """設定を更新"""
        if not self.is_running:
            try:
                self.work_time = int(self.work_var.get())
                self.short_break = int(self.short_var.get())
                if self.current_mode == "work":
                    self.remaining_time = self.work_time * 60
                elif self.current_mode == "short_break":
                    self.remaining_time = self.short_break * 60
                self.update_display()
            except ValueError:
                pass
    
    def toggle_timer(self):
        """タイマーの開始/一時停止を切り替え"""
        if not self.is_running:
            self.start_timer()
        else:
            self.pause_timer()
    
    def start_timer(self):
        """タイマーを開始"""
        self.is_running = True
        self.is_paused = False
        self.start_pause_btn.config(text="一時停止")
        
        if self.timer_thread is None or not self.timer_thread.is_alive():
            self.timer_thread = threading.Thread(target=self.run_timer)
            self.timer_thread.daemon = True
            self.timer_thread.start()
    
    def pause_timer(self):
        """タイマーを一時停止"""
        self.is_running = False
        self.is_paused = True
        self.start_pause_btn.config(text="再開")
    
    def reset_timer(self):
        """タイマーをリセット"""
        self.is_running = False
        self.is_paused = False
        self.start_pause_btn.config(text="開始")
        
        if self.current_mode == "work":
            self.remaining_time = self.work_time * 60
        elif self.current_mode == "short_break":
            self.remaining_time = self.short_break * 60
        else:  # long_break
            self.remaining_time = self.long_break * 60
            
        self.update_display()
    
    def next_session(self):
        """次のセッションに移行"""
        self.is_running = False
        self.is_paused = False
        self.start_pause_btn.config(text="開始")
        
        if self.current_mode == "work":
            # 作業時間終了 → 休憩時間
            if self.current_session % self.sessions_until_long_break == 0:
                self.current_mode = "long_break"
                self.remaining_time = self.long_break * 60
            else:
                self.current_mode = "short_break"
                self.remaining_time = self.short_break * 60
        else:
            # 休憩時間終了 → 作業時間
            self.current_mode = "work"
            self.remaining_time = self.work_time * 60
            if self.current_mode != "long_break":
                self.current_session += 1
            else:
                self.current_session = 1
        
        self.update_display()
    
    def run_timer(self):
        """タイマーのメインループ"""
        while self.remaining_time > 0 and self.is_running:
            time.sleep(1)
            if self.is_running:
                self.remaining_time -= 1
                self.root.after(0, self.update_display)
        
        if self.remaining_time <= 0 and self.is_running:
            self.root.after(0, self.timer_finished)
    
    def timer_finished(self):
        """タイマー終了時の処理"""
        self.is_running = False
        self.start_pause_btn.config(text="開始")
        
        if self.current_mode == "work":
            messagebox.showinfo("時間終了", "作業時間が終了しました！\n休憩時間に入りましょう。")
        else:
            messagebox.showinfo("時間終了", "休憩時間が終了しました！\n作業を再開しましょう。")
        
        self.next_session()
    
    def update_display(self):
        """表示を更新"""
        # 時間表示
        minutes = self.remaining_time // 60
        seconds = self.remaining_time % 60
        self.time_label.config(text=f"{minutes:02d}:{seconds:02d}")
        
        # モード表示
        mode_text = {
            "work": "作業時間",
            "short_break": "短い休憩",
            "long_break": "長い休憩"
        }
        self.mode_label.config(text=mode_text[self.current_mode])
        
        # セッション表示
        if self.current_mode == "work":
            self.session_label.config(text=f"セッション: {self.current_session}/4")
        else:
            self.session_label.config(text="休憩中")

def main():
    root = tk.Tk()
    app = PomodoroTimer(root)
    root.mainloop()

if __name__ == "__main__":
    main()
