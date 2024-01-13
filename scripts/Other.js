var darkModeOnOff = 1;

function ToggleLightDarkMode() {
    var element = document.body;
    element.classList.toggle("dark-mode");
    var darkModeIcon = document.getElementById('darkModeIcon');
    if (darkModeOnOff === 1) {
        darkModeOnOff = 0;
        darkModeIcon.classList.remove('fa-moon');
        darkModeIcon.classList.add('fa-sun');
    } else {
        darkModeOnOff = 1;
        darkModeIcon.classList.remove('fa-sun');
        darkModeIcon.classList.add('fa-moon');
    }
}

var MusicOnOff = 0;
const audio = new Audio();
audio.src = "(no copyright music) Lofi-Chillhop Background Music _Blossom_ _ FREE USE.mp3";
audio.volume = 0.1;

audio.addEventListener('ended', function () {
    audio.currentTime = 0;
    audio.play();
});

function playAudio() {
    var volumeIcon = document.getElementById('volumeIcon');

    if (MusicOnOff === 1) {
        audio.pause();
        MusicOnOff = 0;
        volumeIcon.classList.remove('fa-volume-high');
        volumeIcon.classList.add('fa-volume-mute');
    } else {
        audio.play();
        MusicOnOff = 1;
        volumeIcon.classList.remove('fa-volume-mute');
        volumeIcon.classList.add('fa-volume-high');
    }
}