const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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

function preload() {
    this.load.image('cow', 'assets/cow.png'); // 牛の画像を読み込む
    this.load.image('meadow', 'assets/meadow.jpg'); // 背景画像を読み込む
    this.load.image('milk', 'assets/milk.png'); // 牛乳の画像を読み込む
}

function create() {
    this.add.image(400, 300, 'meadow'); // 背景を設定
    milkText = this.add.text(20, 20, '', { fontSize: '32px', fill: '#000' }); // 初期表示を空にする
    const upgradeText = this.add.text(20, 60, `アップグレード: ${upgradeCost}L`, { fontSize: '24px', fill: '#000' }); // アップグレードのコスト表示

    const cow = this.add.image(400, 300, 'cow').setInteractive();
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
    const upgradeButton = this.add.text(20, 100, 'アップグレード', { fontSize: '24px', fill: '#f00' })
        .setInteractive()
        .on('pointerdown', () => {
            if (milkCount >= upgradeCost) {
                milkCount -= upgradeCost; // コスト分の牛乳を減らす
                milkPerClick++; // クリックあたりの牛乳の量を増やす
                upgradeCost = Math.floor(upgradeCost * 1.5); // 次のアップグレードのコストを増加
                milkText.setText('牛乳: ' + milkCount + 'L'); // 牛乳の量を更新
                upgradeText.setText(`アップグレード: ${upgradeCost}L`); // アップグレードのコストを更新
            }
        });
}

function update() {
    // ゲームの更新ロジックをここに追加
}