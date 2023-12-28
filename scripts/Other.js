function ToggleLightDarkMode() {
    var element = document.body;
    element.classList.toggle("dark-mode");
}

var onOrOff = 0;
const audio = new Audio();
audio.src = "(no copyright music) Lofi-Chillhop Background Music _Blossom_ _ FREE USE.mp3";
audio.volume = 0.1;

audio.addEventListener('ended', function () {
    audio.currentTime = 0;
    audio.play();
});

function playAudio() {
    if (onOrOff === 1) {
        audio.pause();
        onOrOff = 0;
    } else {
        audio.play();
        onOrOff = 1;
    }
}