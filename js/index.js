
let menu = document.getElementById("menu");
let sidebar = document.getElementById("sidebar")
var video = document.getElementById("bg-video");
var pause_play = document.getElementById("pause-play");
let closeBtn = document.getElementById("close-btn");


closeBtn.addEventListener("click", () =>{
    console.log("test");
    sidebar.style.left = "-500px";
    sidebar.style.animation = "close 1s ease";
    video.style.animation = "unblur 2s ease";
    video.style.filter = "blur(0px)";    
});

menu.addEventListener("click", () =>{
    console.log("test2");
    
    sidebar.style.left = 0;
    sidebar.style.animation = "open 1s ease-in-out";
    video.style.animation = "blurit 2s ease";
    video.style.filter = "blur(20px)";
});



function pausePlayVideo(){
    if (video.paused) {
        video.play();
        pause_play.src = "../assets/pause.png";
    }else{
        video.pause();
        pause_play.src = "../assets/play.png";
    }
}