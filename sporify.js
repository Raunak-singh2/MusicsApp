console.log("hellow there");

const song_url = "http://127.0.0.1:5500/songs/";

const getSongFromFile = async () => {
    const response = await fetch(song_url);
    const data = await response.text();

    let createDivElm = document.createElement("div");
    createDivElm.innerHTML = data;
    let asElm = createDivElm.getElementsByTagName("a");
    let songsArray = [];

    for (let indElm of asElm) {
        if (indElm.href.endsWith(".mp3")) {
            songsArray.push(indElm.href.split("/songs/")[1]);
        }

    }
    return songsArray;
}

let currentSong = new Audio();
let songs;
let artistName="Meeka singh"


function playMusice(commingsong, pause = false) {
    currentSong.src = "/songs/" + commingsong;
    if (!pause) {
        currentSong.play();
        playEl.src = "pause.svg";
    }
    document.querySelector(".song_title").innerHTML = decodeURI(commingsong);
    document.querySelector(".song_time").innerHTML = "00 : 00 : 00"
}



const mainFunc = async () => {
    songs = await getSongFromFile();

    let audio = new Audio(songs[0]);
    playMusice(songs[0], true);

    const songList = document.querySelector(".song_name").getElementsByTagName('ul')[0];
    console.log(songList)

    for (let song of songs) {
        songList.innerHTML += ` 
        <li>
        <img class="invert" src="music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("/songs", " ")}</div>
            <div>${artistName}</div>
        </div>
        <div class="play_now">
             <ul>
                <span>play now</sp>
                <img class="invert" src="play.svg" alt="">
             </ul>
        </div>
    </li>
        `;

        const songLi = document.querySelector(".song_name").getElementsByTagName("li");

        Array.from(songLi).forEach((e) => {
            e.addEventListener("click", () => {
                playMusice((e.querySelector(".info").firstElementChild.innerHTML.trim()));

            })
        })

    }



    audio.addEventListener("loadeddata", () => {
        console.log(audio.duration, audio.currentSrc, audio.currentTime);
    })
}

//song time update function

function convertSecondsToMinuteSecond(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;

    // Format the minutes and seconds to have leading zeros
    let formattedMinutes = String(minutes).padStart(2, '0');
    let formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return formattedMinutes + ':' + formattedSeconds;
}

// Example usage
// var totalSeconds = 200; // Replace this with the desired number of seconds
// var formattedTime = convertSecondsToMinuteSecond(totalSeconds);
// console.log(formattedTime); // Output: "01:12"


//Update time and seekbar of musics

currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, "dutatin", currentSong.duration);
    document.querySelector(".song_time").innerHTML = `${convertSecondsToMinuteSecond(currentSong.currentTime.toFixed(0))} : ${convertSecondsToMinuteSecond(currentSong.duration.toFixed(0))}`;
    document.querySelector(".circle").style.left = currentSong.currentTime / currentSong.duration * 100 + "%";
});


document.querySelector(".seek_bar").addEventListener(("click"), e => {
    let changeSongDuration = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = changeSongDuration + "%";
    currentSong.currentTime = ((currentSong.duration) * changeSongDuration) / 100;
})

const prevoiusEl = document.querySelector("#previous");
const playEl = document.querySelector("#play");
const nextEl = document.querySelector("#next");


playEl.addEventListener("click", () => {
    currentSong.paused ? (currentSong.play(), playEl.src = "pause.svg") : (currentSong.pause(), playEl.src = "play.svg");
});



//next and previous button


prevoiusEl.addEventListener("click", () => {
    let findIndexOfSongs = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if ((findIndexOfSongs - 1) > 0) {
        playMusice(songs[findIndexOfSongs - 1]);
    }

});

nextEl.addEventListener("click", () => {
    currentSong.pause();
    let findIndexOfSongs = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if ((findIndexOfSongs + 1) < songs.length) {
        playMusice(songs[findIndexOfSongs + 1]);
    }
});


// Hambarger manu Toggle

document.querySelector(".hambarger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
});

document.querySelector(".close_icon").addEventListener(("click"), () => {
    document.querySelector(".left").style.left = "-100%";
    document.querySelector(".left").style.transition = " all 1s";
});



// volume change and volume icon as wll as

const voiceElm=document.querySelector("#voice");

voiceElm.addEventListener("change",(e)=>{
    currentSong.volume=parseInt(e.target.value + "%") / 100
})


mainFunc();






