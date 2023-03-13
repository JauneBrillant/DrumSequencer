import * as Tone from "https://cdn.skypack.dev/tone";

// DOM取得 ボタン
const playBtn = document.getElementById("play-btn");

// DOM取得 シーケンサー
const stepSeq = document.getElementById("LEDStep").children;
const kickSeq = document.getElementById("kick").children;
const snareSeq = document.getElementById("snare").children;
const clapSeq = document.getElementById("clap").children;
const closedHatSeq = document.getElementById("closedHat").children;
const openHatSeq = document.getElementById("openHat").children;

// 複数のサンプルを読み込む
const sampler = new Tone.Sampler({
    urls: {
        C1: "../sounds/kick.wav",
        C2: "../sounds/snare.wav",
        C3: "../sounds/clap.wav",
        C4: "../sounds/closedhat.wav",
        C5: "../sounds/openhat.wav",
    },
    onload: () => {
        console.log("sample loaded");
    },
}).toDestination();

// 必要な変数の宣言
let audioInitialised = false;
let isPlaying = false;
let index = 0;

//
stepSeq[0].style = "background: red";

// BPM設定
Tone.Transport.bpm.value = 120;

// PLAYボタンが押された時の挙動
playBtn.addEventListener("click", (e) => {
    if (!audioInitialised) {
        Tone.start();
        audioInitialised = true;
    }
    if (isPlaying) {
        e.target.innerText = "PLAY";
        // ループをとめる
        Tone.Transport.stop();
        isPlaying = false;
    } else {
        e.target.innerText = "STOP";
        Tone.Transport.start();
        // シーケンスの最初のノートからループを開始
        loop.start(0);
        isPlaying = true;
    }
});

// シーケンサーのループ処理
const loop = new Tone.Loop((time) => {
    // シーケンサーが今どこを走っているか
    // 1回色をリセットしてから、現在のノートだけ色を変える
    for (let i = 0; i < 16; i++) {
        stepSeq[i].style.background = "#add6c7";
    }
    stepSeq[index].style.background = "red";

    // 音を鳴らす
    if (kickSeq[index].checked) {
        sampler.triggerAttack("C1");
    }
    if (snareSeq[index].checked) {
        sampler.triggerAttack("C2");
    }
    if (clapSeq[index].checked) {
        sampler.triggerAttack("C3");
    }
    if (closedHatSeq[index].checked) {
        sampler.triggerAttack("C4");
    }
    if (openHatSeq[index].checked) {
        sampler.triggerAttack("C5");
    }
    index++;
    index = index % 16;
}, "32n");
