console.log('Let\'s write JavaScript');

let curentSong = new Audio();
let songs = [];
let currFolder = "";

// Time format
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// ✅ FIXED getSongs (JSON based)
async function getSongs(folder) {
    currFolder = folder;

    let res = await fetch(`./${folder}/info.json`);
    let data = await res.json();

    songs = data.songs;

    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";

    songs.forEach((song, i) => {
        songUL.innerHTML += `
        <li>
            <img class="invert" width="34" src="img/music.svg">
            <div class="info">
                <div>${song}</div>
                <div>Ankit kumar singh</div>
            </div>
        </li>`;
    });

    document.querySelectorAll(".songList li").forEach((e, i) => {
        e.addEventListener("click", () => {
            playMusic(songs[i]);
        });
    });

    return songs;
}

// ✅ FIXED playMusic
const playMusic = (track, pause = false) => {
    curentSong.src = `./${currFolder}/${track}`;

    if (!pause) {
        curentSong.play();
        play.src = "img/pause.svg";
    }

    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
};

// ✅ FIXED displayAlbums
async function displayAlbums() {
    let cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = "";

    let folders = ["pun", "English", "man", "slow"];

    for (let folder of folders) {
        let res = await fetch(`./songs/${folder}/info.json`);
        let data = await res.json();

        cardContainer.innerHTML += `
        <div data-folder="${folder}" class="card">
            <div class="play">▶</div>
            <img src="./songs/${folder}/cover.jpg">
            <h2>${data.title}</h2>
            <p>${data.description}</p>
        </div>`;
    }

    document.querySelectorAll(".card").forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);
        });
    });
}

// MAIN
async function main() {

    await getSongs("songs/pun");
    playMusic(songs[0], true);

    await displayAlbums();

    // Play / Pause
    play.addEventListener("click", () => {
        if (curentSong.paused) {
            curentSong.play();
            play.src = "img/pause.svg";
        } else {
            curentSong.pause();
            play.src = "img/play.svg";
        }
    });

    // Time update
    curentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML =
            `${secondsToMinutesSeconds(curentSong.currentTime)}/${secondsToMinutesSeconds(curentSong.duration)}`;

        document.querySelector(".circle").style.left =
            (curentSong.currentTime / curentSong.duration) * 100 + "%";
    });

    // Seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        curentSong.currentTime = (curentSong.duration * percent) / 100;
    });

    // Hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%";
    });

    // Next / Previous
    previous.addEventListener("click", () => {
        let index = songs.indexOf(curentSong.src.split("/").pop());
        if (index > 0) playMusic(songs[index - 1]);
    });

    next.addEventListener("click", () => {
        let index = songs.indexOf(curentSong.src.split("/").pop());
        if (index < songs.length - 1) playMusic(songs[index + 1]);
    });

    // Volume
    document.querySelector(".range input").addEventListener("change", e => {
        curentSong.volume = e.target.value / 100;
    });
}

main();