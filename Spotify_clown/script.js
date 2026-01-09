let songs;
let currfolder;
let currentSong=new Audio();
function formatTime(seconds) {
  // If seconds is not a number or is less than 0, return "00:00"
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(secs).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}


async function getsongs(folder) {
    currfolder=folder
    let a = await fetch(`/${folder}`)
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
     //Show all the songs in playlist
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML=""
    for (const song of songs) {

        songul.innerHTML = songul.innerHTML + `<li><img class="invert" src="images/music.svg" alt="">
                        <div class="info">
                        <div>${song.replaceAll("%20", " ")}</div>
                        <div>Akshit</div>
                        </div>
                        <div class="playnow">
                        <span>Play now</span>
                        <img class="invert" src="images/play.svg" alt="playnow">
                        </div>
                        
        </li>`;

    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{

            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
        
    }) 

    return songs
}
const playMusic=(track,pause=false)=>{
    //let audio=new Audio("/songs/" + track)
    currentSong.src=`/${currfolder}/` + track
    if(!pause){
        currentSong.play()
        play.src="images/pause.svg"

    }
    document.querySelector(".songinfo").innerHTML= decodeURI(track)
    document.querySelector(".songtime").innerHTML= "00:00 / 00:00 "
   

}
async function displayAlbums(){
    let a = await fetch(`/songs/`)
    let response = await a.text();

    

    let div = document.createElement("div")
    div.innerHTML = response
    let anchors=div.getElementsByTagName("a")
    Array.from(anchors).forEach(async e=>{
        if(e.href.includes("/songs")){
            
            let folder=(e.href.split("/").slice(-2)[0])
            let cardContainer=document.querySelector(".cardContainer")
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response);
            cardContainer.innerHTML=cardContainer.innerHTML + `<div class="card" data-folder=${folder}>
                        <div class="play"><svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 26 26" class="play-icon">
                                <circle cx="13" cy="13" r="13" fill="#1fd760" />
                                <g transform="translate(5,4) scale(0.65)">
                                    <path fill="#000000"
                                        d="M20.208 11.857L6.902 5.26a1.312 1.312 0 0 0-1.268.052a1.272 1.272 0 0 0-.619 1.09V19.6c0 .443.233.856.619 1.089a1.316 1.316 0 0 0 1.269.052l13.306-6.599c.438-.218.716-.658.716-1.143s-.279-.924-.717-1.142z" />
                                </g>
                            </svg>

                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="playlist1">
                        <h3>${response.title}</h3>
                        <p>${response.description}</p>
                    </div>`
        }
        Array.from(document.getElementsByClassName("card")).forEach(e=>{

        e.addEventListener("click",async item=>{
            console.log(item,item.currentTarget.dataset )
            songs =await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })
})

}
async function main() {
    //Get the list of all songs
    await getsongs("songs/pit")
    playMusic(songs[0],true)
    displayAlbums()

   
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src="images/pause.svg"
        }
        else{
            currentSong.pause()
            play.src="images/play.svg"
        }
    })

    currentSong.addEventListener("timeupdate",()=>{

        document.querySelector(".songtime").innerHTML=`${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100 + "%"
    })
    //add an event listener to the seekbar
    document.querySelector(".seekbar").addEventListener("click",(e)=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left=percent +"%"
        currentSong.currentTime=(currentSong.duration*percent)/100
    })
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%"
    })
    prev.addEventListener("click",()=>{
        console.log("Prev clicked");

        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if(index-1>=0){
            playMusic(songs[index-1])
        }
        
        
    })
    next.addEventListener("click",()=>{
        console.log("next click");
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if(index+1<songs.length){
            playMusic(songs[index+1])
        }

    })
    let m=0.1
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        
        m=currentSong.volume=parseInt(e.target.value)/100
    })
    document.addEventListener("keydown", (e) => {
    // Don't act when typing in inputs
    if (e.target.tagName === "INPUT") return;

    if (e.code === "Space") {
        e.preventDefault(); // stop page scrolling
        if (currentSong.paused) {
            currentSong.play();
            play.src = "images/pause.svg";
        } else {
            currentSong.pause();
            play.src = "images/play.svg";
        }
    } 
    else if (e.code === "ArrowLeft") {
        // Move 5 seconds back
        currentSong.currentTime = Math.max(0, currentSong.currentTime - 5);
    } 
    else if (e.code === "ArrowRight") {
        // Move 5 seconds forward
        currentSong.currentTime = Math.min(currentSong.duration, currentSong.currentTime + 5);
    }

    // Update the circle position visually
    let percent = (currentSong.currentTime / currentSong.duration) * 100;
    document.querySelector(".circle").style.left = percent + "%";
});


    document.querySelector(".volume>img").addEventListener("click",(e)=>{
        if(e.target.src.includes("volume.svg")){

            e.target.src="images/mute.svg"
            currentSong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0
            
        }
        else {
            e.target.src="images/volume.svg"
            console.log(m);
            
            document.querySelector(".range").getElementsByTagName("input")[0].value=m*100
        }
    })
    
}
main()