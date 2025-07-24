// おみくじデータ
const fortuneData = {
    '大吉': {
        messages: [
            '今日は最高の一日になるでしょう。新しいことに挑戦する絶好のチャンスです。',
            '素晴らしい出会いがあなたを待っています。積極的に行動しましょう。',
            '長年の努力が実を結ぶ時が来ました。自信を持って前進してください。',
            '幸運の波があなたを包んでいます。今日始めることは必ず成功するでしょう。'
        ],
        details: {
            恋愛: '◎', 仕事: '◎', 健康: '◎', 金運: '◎'
        }
    },
    '中吉': {
        messages: [
            '良い流れが続いています。周りの人への感謝を忘れずに。',
            '努力が認められる日です。謙虚な気持ちを大切にしましょう。',
            '新しい可能性が見えてきます。チャンスを逃さないように。',
            '安定した運気です。計画的に物事を進めると良いでしょう。'
        ],
        details: {
            恋愛: '○', 仕事: '◎', 健康: '○', 金運: '○'
        }
    },
    '小吉': {
        messages: [
            '小さな幸せが積み重なる日です。日常に感謝しましょう。',
            '穏やかな一日になりそうです。リラックスして過ごしましょう。',
            '身近な人からの良いニュースがありそうです。',
            'ゆっくりとした成長の時期です。焦らず着実に進みましょう。'
        ],
        details: {
            恋愛: '○', 仕事: '○', 健康: '◎', 金運: '△'
        }
    },
    '吉': {
        messages: [
            '平穏な一日です。現状維持を心がけましょう。',
            '小さな変化が良い結果をもたらします。',
            '友人や家族との時間を大切にしてください。',
            '今日は学びの日です。新しい知識を得られるでしょう。'
        ],
        details: {
            恋愛: '○', 仕事: '○', 健康: '○', 金運: '○'
        }
    },
    '末吉': {
        messages: [
            '慎重に行動すれば良い結果が得られます。',
            '今は準備の時期です。将来に向けて力を蓄えましょう。',
            '小さなことから始めてみてください。',
            '忍耐が必要な時期ですが、必ず報われます。'
        ],
        details: {
            恋愛: '△', 仕事: '○', 健康: '○', 金運: '△'
        }
    },
    '凶': {
        messages: [
            '今日は無理をせず、休息を取ることが大切です。',
            '困難な時期ですが、必ず乗り越えられます。',
            '周りの人に助けを求めることも大切です。',
            '今は耐える時期。明日はきっと良い日になります。'
        ],
        details: {
            恋愛: '△', 仕事: '△', 健康: '△', 金運: '△'
        }
    }
};

// DOM要素の取得
const drawButton = document.getElementById('drawButton');
const resetButton = document.getElementById('resetButton');
const shareButton = document.getElementById('shareButton');
const omikujiBox = document.getElementById('omikujiBox');
const omikujiContent = document.getElementById('omikujiContent');
const resultActions = document.getElementById('resultActions');
const videoContainer = document.getElementById('videoContainer');
const daikichiVideo = document.getElementById('daikichi-video');

// 現在の結果を保存
let currentResult = null;

// おみくじを引く関数
function drawOmikuji() {
    // ボタンを無効化
    drawButton.disabled = true;
    
    // ローディング表示
    showLoading();
    
    // アニメーション効果
    omikujiBox.classList.add('drawing');
    
    // 1.5秒後に結果を表示
    setTimeout(() => {
        const result = generateFortune();
        showResult(result);
        currentResult = result;
        
        // アニメーション終了
        omikujiBox.classList.remove('drawing');
        
        // ボタンを有効化
        drawButton.disabled = false;
        
        // アクションボタンを表示
        resultActions.style.display = 'flex';
    }, 1500);
}

// ローディング表示
function showLoading() {
    omikujiContent.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <div class="loading-text">運勢を占っています...</div>
        </div>
    `;
}

// おみくじ結果生成
function generateFortune() {
    const levels = Object.keys(fortuneData);
    const weights = [15, 25, 25, 20, 10, 5]; // 大吉から凶までの重み
    
    // 重み付きランダム選択
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < levels.length; i++) {
        random -= weights[i];
        if (random <= 0) {
            const level = levels[i];
            const data = fortuneData[level];
            const message = data.messages[Math.floor(Math.random() * data.messages.length)];
            
            return {
                level: level,
                message: message,
                details: data.details,
                timestamp: new Date()
            };
        }
    }
    
    // フォールバック
    return generateFortune();
}

// 結果表示
function showResult(result) {
    const detailsHtml = Object.entries(result.details)
        .map(([key, value]) => `
            <div class="detail-item">
                <div class="detail-label">${key}</div>
                <div class="detail-value">${value}</div>
            </div>
        `).join('');
    
    omikujiContent.innerHTML = `
        <div class="result-content">
            <div class="fortune-level ${result.level}">${result.level}</div>
            <div class="fortune-message">${result.message}</div>
            <div class="fortune-details">
                ${detailsHtml}
            </div>
        </div>
    `;
    
    // 大吉の場合は動画を表示
    if (result.level === '大吉') {
        showDaikichiVideo();
    } else {
        hideDaikichiVideo();
    }
}

// 初期状態に戻す
function resetOmikuji() {
    omikujiContent.innerHTML = `
        <div class="initial-state">
            <div class="omikuji-icon">🏮</div>
            <p class="instruction">下のボタンを押して<br>おみくじを引いてください</p>
        </div>
    `;
    
    resultActions.style.display = 'none';
    currentResult = null;
    drawButton.disabled = false;
    
    // 動画を非表示にする
    hideDaikichiVideo();
}

// 大吉時の動画を表示
function showDaikichiVideo() {
    videoContainer.style.display = 'block';
    // 動画を最初から再生
    daikichiVideo.currentTime = 0;
    daikichiVideo.play().catch(error => {
        console.log('動画の自動再生に失敗しました:', error);
        // 自動再生に失敗した場合は、ユーザーの操作を待つ
    });
}

// 大吉時の動画を非表示
function hideDaikichiVideo() {
    videoContainer.style.display = 'none';
    daikichiVideo.pause();
    daikichiVideo.currentTime = 0;
}

// 結果をシェア
function shareResult() {
    if (!currentResult) return;
    
    const shareText = `おみくじの結果: ${currentResult.level}\n${currentResult.message}\n\n#おみくじ #運勢占い`;
    
    if (navigator.share) {
        // Web Share API対応ブラウザ
        navigator.share({
            title: 'おみくじの結果',
            text: shareText,
            url: window.location.href
        }).catch(err => {
            console.log('シェアがキャンセルされました');
        });
    } else {
        // フォールバック: クリップボードにコピー
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('結果をクリップボードにコピーしました！');
        }).catch(() => {
            // さらなるフォールバック
            const textArea = document.createElement('textarea');
            textArea.value = shareText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('結果をクリップボードにコピーしました！');
        });
    }
}

// 通知表示
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    // アニメーション用CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // 3秒後に削除
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            document.body.removeChild(notification);
            document.head.removeChild(style);
        }, 300);
    }, 3000);
}

// イベントリスナーの設定
drawButton.addEventListener('click', drawOmikuji);
resetButton.addEventListener('click', resetOmikuji);
shareButton.addEventListener('click', shareResult);

// キーボードショートカット
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !drawButton.disabled) {
        if (currentResult) {
            resetOmikuji();
        } else {
            drawOmikuji();
        }
    }
});

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('おみくじWebサイトが読み込まれました！');
    
    // サービスワーカーの登録（PWA対応）
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('Service Worker registered successfully');
            })
            .catch(error => {
                console.log('Service Worker registration failed');
            });
    }
});
