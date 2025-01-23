const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

const audio = new Audio('your-audio-file.mp3'); // Replace with your audio file

let isPlaying = false;

function togglePlay() {
  if (isPlaying) {
    audio.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
  } else {
    audio.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  }
  isPlaying = !isPlaying;
}

function updateProgress() {
  const { currentTime, duration } = audio;
  progress.value = (currentTime / duration) * 100 || 0;
  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secs}`;
}

playBtn.addEventListener('click', togglePlay);

audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', () => {
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
  isPlaying = false;
});

// Optional: You can add interactivity to enhance the experience
console.log("Spotify Clone is running!");

