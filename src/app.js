import * as Tone from "https://cdn.skypack.dev/tone";

const makeSynth = (count) => {
    const synths = [];
    for (let i = 0; i < count; i++) {
        let synth = new Tone.Synth().toDestination();

        synths.push(synth);
    }

    return synths;
};

function makeGrid(notes) {
    const rows = [];
    for (let note of notes) {
        const row = [];
        for (let j = 0; j < 8; j++) {
            row.push({
                note: note,
                isActive: false,
            });
        }
        rows.push(row);
    }
    return rows;
}

// -----------------------------------------------------------------------------------------

const synths = makeSynth(5);
const notes = ["F4", "Eb4", "C4", "Bb3", "Ab3"];
const grid = makeGrid(notes);
let position = 0;
let isPlaying = false;
let isStarted = false;

// ------------------------------------------------------------------------------------------

const configLoop = () => {
    const repeat = (time) => {
        grid.forEach((row, index) => {
            let synth = synths[index];
            let note = row[position];
            if (note.isActive) {
                synth.triggerAttackRelease(note.note, "8n", time);
            }
        });
        position = (position + 1) % 8;
    };
    Tone.Transport.bpm.value = 120;
    Tone.Transport.scheduleRepeat(repeat, "8n");
};

const makeLedBar = () => {
    const sequencer = document.getElementById("sequencer");
    const ledBar = document.createElement("div");
    ledBar.className = "LEDRow";
    ledBar.id = "LEDRow";
    for (let i = 0; i < 8; i++) {
        const ledNote = document.createElement("div");
        ledNote.className = "LEDNote";
        ledBar.appendChild(ledNote);
    }
    sequencer.appendChild(ledBar);
};

const makeSequencer = () => {
    // 親要素を取得
    const sequencer = document.getElementById("sequencer");

    // グリッドを探索
    grid.forEach((row, rowIndex) => {
        // それぞれの行に対して親要素を作成
        const seqRow = document.createElement("div");

        // 作成した要素にクラス名を付与
        seqRow.className = "sequencer" + (rowIndex + 1);

        // ノートを探索
        row.forEach((note, noteIndex) => {
            // 要素を作成
            const button = document.createElement("button");

            // 作成した要素にクラス名を付与
            button.className = "note";

            // ノートがクリックされたら関数を呼ぶ
            button.addEventListener("click", function (e) {
                handleNoteClick(rowIndex, noteIndex, e);
            });

            // 各シーケンスに各ノートを追加
            seqRow.appendChild(button);
        });

        // 親divに各シーケンスを追加
        sequencer.appendChild(seqRow);
    });
};

// グリッド全体を探索して、クリックされたノートのisActiveを反転させる。
const handleNoteClick = (clickedRowIndex, clickedNoteIndex, e) => {
    grid.forEach((row, rowIndex) => {
        row.forEach((note, noteIndex) => {
            if (rowIndex === clickedRowIndex && noteIndex === clickedNoteIndex) {
                note.isActive = !note.isActive;
            }
            // noteがactiveの場合、クラスネームを付与して色を変える。
            if (note.isActive) {
                e.target.classList.toggle("active");
            }
        });
    });
};

const configPlayButton = () => {
    const button = document.getElementById("play-button");
    button.addEventListener("click", (e) => {
        if (!isStarted) {
            Tone.start();
            Tone.getDestination().volume.rampTo(-10, 0.001);
            configLoop();
            isStarted = true;
        }

        if (isPlaying) {
            e.target.innerText = "PLAY";
            Tone.Transport.stop();
            isPlaying = false;
        } else {
            e.target.innerText = "STOP";
            Tone.Transport.start();
            isPlaying = true;
        }
    });
};

// const loop = new Tone.Loop((time) => {
//     for (let i = 0; i < 8; i++) {
//         LEDRow[i].style.gackground = "lightgrey";
//     }
// });

// LEDバーのdiv要素を追加
makeLedBar();

window.addEventListener("DOMContentLoaded", () => {
    configPlayButton();
    makeSequencer();
});
