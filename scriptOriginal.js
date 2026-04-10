
console.log('Let\'s write JavaScript');
let curentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid input";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`)
    // let a = await fetch(`/songs/${folder}/info.json`);

    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }


    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + ` <li><img class="invert" width="34" src="img/music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                <div>Ankit kumar singh</div>
                            </div>
                            <div class="playNow">
                                 <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div> </li>` ;
    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    return songs
}
const playMusic = (track, pause = false) => {
    // let audio =new Audio("/songs/"+track)


    curentSong.src = `/${currFolder}/` + track
    if (!pause) {
        curentSong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}
async function displayAlbums() {
    console.log("displaying albums")
    let a = await fetch(`/songs/`)
    // let a = await fetch(`/songs/${folder}/info.json`);

    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    
    // cardContainer.innerHTML = "";  

    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-1)[0]
            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            // fetch("https://https://astonishing-moxie-c91499.netlify.app/songs/info.json")
            if (!a.ok) {
                console.error(`info.json not found for folder: ${folder}`);
                continue; // Skip to the next folder
            }
            let response = await a.json(); 
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
            <div class="play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                        stroke-linejoin="round" />
                </svg>
            </div>

            <img src="/songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        }
    }

 // Load the playlist whenever the card is clicked 
 Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
        console.log(item.target, item.currentTarget.dataset)
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        playMusic(songs[0])
    })
})
}



async function main() {
     await getSongs("songs/pun");

    playMusic(songs[0], true)

    await displayAlbums()



    play.addEventListener("click", () => {
        if (curentSong.paused) {
            curentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            curentSong.pause()
            play.src = "img/play.svg"
        }
    })

     // Listen fo time update finction
     curentSong.addEventListener("timeupdate", () => {
        console.log(curentSong.currentTime, curentSong.duration)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(curentSong.currentTime)}/${secondsToMinutesSeconds(curentSong.duration)}`

        document.querySelector(".circle").style.left = (curentSong.currentTime / curentSong.duration) * 100 + "%"
    })


    // Add event to seek bar  
    document.querySelector(".seekbar").addEventListener("click", e => {
        let precent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = precent + "%";
        curentSong.currentTime = (curentSong.duration * precent) / 100;
    })


     // Add an event listener for Hamburger
     document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
        document.querySelector(".left").style.width = "344px";
    })

    
    // Add an event listener for close hamburger
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%";
        // document.querySelector(".left").style.width="444px";
    })




    // Add an event listener to previous and next

    previous.addEventListener("click", () => {
        console.log("Previous clicked")
        let index = songs.indexOf(curentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })
    next.addEventListener("click", () => {
        console.log("next clicked")
        let index = songs.indexOf(curentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })
   
   


    // Add an event to volume 
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to ", e.target.value)
        curentSong.volume = parseInt(e.target.value) / 100

    })
        // Add event listener to mute the track
        document.querySelector(".volume>img").addEventListener("click", e=>{ 
            if(e.target.src.includes("volume.svg")){
                e.target.src = e.target.src.replace("volume.svg", "mute.svg")
                currentSong.volume = 0;
                document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
            }
            else{
                e.target.src = e.target.src.replace("mute.svg", "volume.svg")
                currentSong.volume = .10;
                document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
            }
    
        })

   

}

main();
