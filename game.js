const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let milkCount = 0;
let milkText;
let isAnimating = false; // アニメーション中かどうかを管理するフラグ
let milkPerClick = 1; // クリックあたりの牛乳の量
let upgradeCost = 10; // アップグレードのコスト
let autoMilkAmount = 0; // 自動収集の牛乳の量
let autoUpgradeCost = 50; // 自動収集のアップグレードコスト

function preload() {
    this.load.image('cow', 'assets/cow.png'); // 牛の画像を読み込む
    this.load.image('meadow', 'assets/meadow.jpg'); // 背景画像を読み込む
    this.load.image('milk', 'assets/milk.png'); // 牛乳の画像を読み込む
}

function create() {
    this.add.image(640, 360, 'meadow'); // 背景を設定
    milkText = this.add.text(20, 20, '', { fontSize: '48px', fill: '#000' }); // 牛乳の量を大きく表示

    const cow = this.add.image(640, 360, 'cow').setInteractive();
    cow.setScale(0.75); // 牛の画像を75%のサイズに縮小

    cow.on('pointerdown', () => {
        if (isAnimating) return; // アニメーション中は何もしない

        milkCount += milkPerClick; // クリックあたりの牛乳の量を加算
        milkText.setText('牛乳: ' + milkCount + 'L'); // 牛乳の量をL単位で表示

        // 牛乳の画像を牛の左右にランダムに表示
        const direction = Math.random() < 0.5 ? -1 : 1; // 左右の方向を決定
        const milk = this.add.image(cow.x + (direction * 150), cow.y, 'milk').setOrigin(0.5, 1);
        milk.setScale(0.3); // 牛乳のサイズを小さくする
        milk.setAlpha(1); // 初期の透明度を設定
        milk.rotation = Phaser.Math.DegToRad(direction * 15); // 左右に15度回転させる

        this.tweens.add({
            targets: milk,
            y: cow.y - 50, // 牛から上に出るように移動
            alpha: 0, // 徐々に透明にする
            duration: 500,
            ease: 'Power1',
            onComplete: () => {
                milk.destroy(); // アニメーションが終わったら牛乳の画像を削除
            }
        });

        // 牛の伸び縮みアニメーション
        isAnimating = true; // アニメーション中フラグを立てる
        this.tweens.add({
            targets: cow,
            scaleY: 0.85, // 縮む
            duration: 100,
            yoyo: true, // 元のサイズに戻る
            onComplete: () => {
                isAnimating = false; // アニメーションが完了したらフラグを戻す
            }
        });
    });

    // アップグレードボタンを作成
    const upgradeButton = this.add.text(20, 140, '牛を増やす', { fontSize: '24px', fill: '#fff', backgroundColor: '#007BFF', padding: { x: 10, y: 5 } })
        .setInteractive()
        .on('pointerdown', () => {
            if (milkCount >= upgradeCost) {
                milkCount -= upgradeCost; // コスト分の牛乳を減らす
                milkPerClick++; // クリックあたりの牛乳の量を増やす
                upgradeCost = Math.floor(upgradeCost * 1.5); // 次のアップグレードのコストを増加
                milkText.setText('牛乳: ' + milkCount + 'L'); // 牛乳の量を更新
                upgradeCostText.setText(`${upgradeCost}L`); // アップグレードコストを更新
            }
        })
        .on('pointerover', () => {
            upgradeButton.setStyle({ fill: '#FFD700' }); // ホバー時の色変更
        })
        .on('pointerout', () => {
            upgradeButton.setStyle({ fill: '#fff' }); // ホバー解除時の色変更
        });

    // アップグレードコストをボタンの右に表示
    const upgradeCostText = this.add.text(upgradeButton.x + upgradeButton.width + 10, 140, `${upgradeCost}L`, { fontSize: '20px', fill: '#000' });

    // 自動収集のアップグレードボタンを作成
    const autoUpgradeButton = this.add.text(20, 180, 'バイトを増やす', { fontSize: '24px', fill: '#fff', backgroundColor: '#007BFF', padding: { x: 10, y: 5 } })
        .setInteractive()
        .on('pointerdown', () => {
            if (milkCount >= autoUpgradeCost) {
                milkCount -= autoUpgradeCost; // コスト分の牛乳を減らす
                autoMilkAmount++; // 自動収集の量を増やす
                autoUpgradeCost = Math.floor(autoUpgradeCost * 1.5); // 次のアップグレードのコストを増加
                milkText.setText('牛乳: ' + milkCount + 'L'); // 牛乳の量を更新
                autoUpgradeCostText.setText(`${autoUpgradeCost}L`); // 自動収集コストを更新
            }
        })
        .on('pointerover', () => {
            autoUpgradeButton.setStyle({ fill: '#FFD700' }); // ホバー時の色変更
        })
        .on('pointerout', () => {
            autoUpgradeButton.setStyle({ fill: '#fff' }); // ホバー解除時の色変更
        });

    // 自動収集のアップグレードコストをボタンの右に表示
    const autoUpgradeCostText = this.add.text(autoUpgradeButton.x + autoUpgradeButton.width + 10, 180, `${autoUpgradeCost}L`, { fontSize: '20px', fill: '#000' });

    // 自動収集のタイマーを設定
    this.time.addEvent({
        delay: 1000, // 1秒ごとに
        callback: () => {
            milkCount += autoMilkAmount; // 自動収集の牛乳を加算
            milkText.setText('牛乳: ' + milkCount + 'L'); // 牛乳の量を更新
        },
        loop: true // 繰り返し実行
    });
}

function update() {
    // ゲームの更新ロジックをここに追加
}