document.addEventListener("keydown", function (event) {
  if (
    event.ctrlKey &&
    (event.key === "=" || event.key === "-" || event.key === "0")
  ) {
    event.preventDefault();
  }
});

document.addEventListener("wheel", function (event) {
  if (event.ctrlKey) {
    event.preventDefault();
  }
}, { passive: false });

document.addEventListener("DOMContentLoaded", () => {
  setupMediaSession();
  initializeSplashScreen();

  // Check if a user is logged in and if their session is still valid
  if (sessionStorage.getItem("loggedInUser")) {
    checkDailyLogin();
  }

  document.querySelector(".logout-btn").addEventListener("click", logout);

  // Auto-login if session exists
  const loggedInUser = sessionStorage.getItem("loggedInUser");
  if (loggedInUser) showPlayer(loggedInUser);
});

// User Data with Device Tracking
const validUsers = [
  { username: "Mohan", password: "123", maxSessions: 1, activeSessions: [] },
  { username: "sathiya", password: "2005", maxSessions: 1, activeSessions: [] },
  { username: "Praveen", password: "2018", maxSessions: 1, activeSessions: [] },
  { username: "Nandha", password: "naddy@2002", maxSessions: 1, activeSessions: [] },
  { username: "ari", password: "0000", maxSessions: 1, activeSessions: [] },
  { username: "Preethi", password: "2002", maxSessions: 1, activeSessions: [] },
  { username: "Alainila", password: "2025", maxSessions: 1, activeSessions: [] }
];

// Validate User Login
function validateUser() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const user = validUsers.find(u => u.username === username && u.password === password);

  if (!user) return showMessage("Invalid username or password!", "red");

  const currentDeviceId = generateDeviceId();
  const activeSessions = user.activeSessions.filter(s => s.deviceId !== currentDeviceId);

  if (activeSessions.length >= user.maxSessions) {
    return showMessage(`Maximum logins (${user.maxSessions}) reached for this account.`, "red");
  }

  // Store login details and allow access
  user.activeSessions.push({ deviceId: currentDeviceId, loginTime: new Date().toISOString() });

  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  sessionStorage.setItem("loggedInUser", username);
  sessionStorage.setItem("deviceId", currentDeviceId);
  localStorage.setItem("loginDate", today);

  showMessage("Login successful!", "green");
  showPlayer(username);
}

// Check if the user should be logged out at midnight
function checkDailyLogin() {
  const loggedInUser = sessionStorage.getItem("loggedInUser");
  if (!loggedInUser) return; // No user is logged in, skip auto-logout check

  const storedDate = localStorage.getItem("loginDate");
  const today = new Date().toISOString().split('T')[0];

  if (storedDate !== today) {
    logout(true);
  }
}

// Show Player and Hide Login
function showPlayer(username) {
  document.querySelector(".login-container").style.display = "none";
  document.querySelector(".player-container").style.display = "block";
  document.getElementById("user").textContent = username;
}

// Logout Functionality
function logout(autoLogout = false) {
  const loggedInUser = sessionStorage.getItem("loggedInUser");
  const deviceId = sessionStorage.getItem("deviceId");
  const user = validUsers.find(u => u.username === loggedInUser);

  if (user) {
    user.activeSessions = user.activeSessions.filter(s => s.deviceId !== deviceId);
  }

  sessionStorage.clear();
  localStorage.removeItem("loginDate");

  showMessage(autoLogout ? "Session expired! Please log in again." : "Logged out successfully!", "red");

  setTimeout(() => window.location.reload(), 2000);
}

// Function to display floating messages
function showMessage(text, color) {
  const message = document.createElement("div");
  Object.assign(message.style, {
    position: "fixed",
    top: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "10px 20px",
    backgroundColor: color === "green" ? "#4caf50" : "#ff3b3b",
    color: "white",
    borderRadius: "5px",
    zIndex: "1000"
  });

  message.textContent = text;
  document.body.appendChild(message);

  setTimeout(() => message.remove(), 3000);
}

// Generate Unique Device ID
function generateDeviceId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

// Initialize Splash Screen
function initializeSplashScreen() {
  const splashScreen = document.querySelector(".splash-screen");
  const mainContent = document.querySelector(".main-content");

  setTimeout(() => {
    splashScreen.style.opacity = "0";
    splashScreen.style.pointerEvents = "none";
    setTimeout(() => {
      splashScreen.style.display = "none";
      mainContent.style.display = "block";
    }, 500);
  }, 500);
}

// WebViewString Communication with MIT App Inventor
function updateAppInventorState(state) {
  if (window.AppInventor) window.AppInventor.setWebViewString(state);
}

// Update MIT App Inventor with Media Session Status
function updateAppInventorWithMediaSessionStatus(status) {
  if (window.AppInventor) window.AppInventor.setWebViewString("MediaSessionStatus: " + status);
}

// Media Session API Integration
function setupMediaSession() {
  if ("mediaSession" in navigator) {
    navigator.mediaSession.setActionHandler("play", playSong);
    navigator.mediaSession.setActionHandler("pause", pauseSong);
    navigator.mediaSession.setActionHandler("nexttrack", playNextSong);
    navigator.mediaSession.setActionHandler("previoustrack", playPrevSong);

    updateAppInventorWithMediaSessionStatus("Media Session Enabled");
  } else {
    updateAppInventorWithMediaSessionStatus("Media Session Not Supported");
  }
}


// Existing code remains the same
const SONGS = [
  // 1 list
  {
    title: "Naan-Gaali",
    artist: "Mohan",
    url: "Naan-Gaali-MassTamilan.dev.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Adiye",
    artist: "GV.Prakash",
    url: "Adiye-MassTamilan.fm.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Aasa Kooda",
    artist: "Sai",
    url: "Aasa Kooda.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Adangatha Asuran",
    artist: "A.R Rahman",
    url: "Adangaatha Asuran.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "adada-Mazhaida",
    artist: "yuvan",
    url: "Adada-Mazhaida.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
    {
    title: "Yendi Unna Naan",
    artist: "Nishan",
    url: "Yendi Unna Naan (Azhage Azhage En Azhage).mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Adiye-Sakkarakatti",
    artist: "hiphop Tamizha",
    url: "Adiye-Sakkarakatti-MassTamilan.com.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Anbenum",
    artist: "Aniruth",
    url: "Anbenum-MassTamilan.dev.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Arabic Kuthu",
    artist: "Anirudh",
    url: "Arabic-Kuthu---Halamithi-Habibo-MassTamilan.so.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Aye Aye Aye",
    artist: "Hiphop tamizha",
    url: "Aye-Aye-Aye-MassTamilan.fm.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Badass",
    artist: "Anirudh",
    url: "Badass-MassTamilan.dev.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "En Kadhal",
    artist: "yuvan",
    url: "En-Kadhal-Solla.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "En Rojaa Neeye",
    artist: "Hesham",
    url: "En-Rojaa-Neeye-MassTamilan.dev (1).mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Golden Sparrow",
    artist: "G.V prakash",
    url: "Golden-Sparrow-MassTamilan.dev.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Hi Sonna Pothum",
    artist: "Hiphop Tamizha",
    url: "Hi-Sonna-Pothum-MassTamilan.org.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Hunter Vantar",
    artist: "Nandha",
    url: "Hunter Vantaar.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Indru Netru",
    artist: "Hiphop tamizha",
    url: "Indru-Netru-Naalai.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Kaathu Mela",
    artist: "Paal Dabba",
    url: "Kaathu Mela.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "kaavaalaa",
    artist: "Anirudh",
    url: "Kaavaalaa-MassTamilan.dev.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Kadhale Kadhale",
    artist: "Hiphop Tamizha",
    url: "Kadhale-Kadhale.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Kadhalikathey",
    artist: "Hiphop Tamizha",
    url: "Kadhalikathey-MassTamilan.com.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Kangal Edho",
    artist: "Santhosh",
    url: "Kangal-Edho-MassTamilan.dev.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Kannala kannala",
    artist: "Hiphop Tamizha",
    url: "Kannala-Kannala.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Kannamma",
    artist: "A.R Rahman",
    url: "Kannamma-MassTamilan.io.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Karakudi Ilavarasi",
    artist: "Hiphop Tamizha",
    url: "Karakudi-Ilavarasi-En-Nenja-MassTamilan.com.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Katchi Sera",
    artist: "Sai",
    url: "Katchi Sera.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Kerala",
    artist: "Hiphop Tamizha",
    url: "Kerala-Song-MassTamilan.org.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "kissik",
    artist: "Devi",
    url: "Kissik.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Kokkarakko",
    artist: "Vidyasagar",
    url: "Kokkarakko.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Madras To Madurai",
    artist: "Hiphop Tamizha",
    url: "Madras-To-Madurai-MassTamilan.fm.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Manasula",
    artist: "illayaraja",
    url: "Manasula.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Marudhaani",
    artist: "A.R Rahman",
    url: "Marudhaani-Marudhaani.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Matta",
    artist: "Anirudh",
    url: "Matta.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Minikki Minikki",
    artist: "Santhos",
    url: "Minikki Minikki.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Morattu Single",
    artist: "Hiphop tamizha",
    url: "Morattu-Single-MassTamilan.org.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Muthu Mazhaiye",
    artist: "Devi",
    url: "Muthu-Mazhaiye.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Naa Ready",
    artist: "Anirudh",
    url: "Naa-Ready-MassTamilan.dev.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Nee Nenacha",
    artist: "Anirudh",
    url: "Nee-Nenacha-MassTamilan.org.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Neeyum Naanum Anbe",
    artist: "hiphop Tamizha",
    url: "Neeyum-Naanum-Anbe-MassTamilan.com.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Oh Raaya",
    artist: "A.R Rahman",
    url: "Oh Raaya.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "oxygen",
    artist: "hiphop Tamizha",
    url: "Oxygen.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Paththavaikkum",
    artist: "Santhos",
    url: "Paththavaikkum.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "pazhagikalam",
    artist: "Hiphop tamizha",
    url: "Pazhagikalam-MassTamilan.fm.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Pogatha Yannavittu",
    artist: "Anirudh",
    url: "Pogatha-Yennavittu-MassTamilan.com.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "pookal Pookum",
    artist: "G.V Parakash",
    url: "Pookal Pookum.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Poongatre poongatre",
    artist: "A.R Rahman",
    url: "Poongatre-Poongatre.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },

  {
    title: "Railin Oligal",
    artist: "Govind",
    url: "Railin Oligal.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Rathamaarey",
    artist: "Anirudh",
    url: "Rathamaarey-MassTamilan.dev.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Sait Ji Saitji",
    artist: "Hiphop Tamizha",
    url: "Sait Ji Saitji - SenSongsMp3.Co.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Sawadeeka",
    artist: "Anirudh",
    url: "Sawadeeka-MassTamilan.dev.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Sha La La",
    artist: "Vidya",
    url: "Sha La La.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Soora Thenga",
    artist: "Vidya",
    url: "Soora Thenga Addra.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Spark",
    artist: "yuvan",
    url: "Spark.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Suthuthe Suthuthe",
    artist: "Yuvan",
    url: "Suthuthe-Suthuthe-Bhoomi.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },

  {
    title: "Takkunu Takkunu",
    artist: "Anirudh",
    url: "Takkunu-Takkunu-MassTamilan.org.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Thenkizhakku",
    artist: "Santhos",
    url: "Thenkizhakku.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Thli Thli Mazhaiyaai",
    artist: "yuvan",
    url: "Thuli-Thuli-Mazhaiyaai.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "unakku Thaan",
    artist: "Santhos",
    url: "Unakku-Thaan-MassTamilan.dev.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Urugi Urugi",
    artist: "Siddhu",
    url: "Urugi Urugi.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Va va VA Vannila",
    artist: "Hiphop Tamizha",
    url: "Va-Va-Va-Vannila-MassTamilan.fm.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Vaadi Nee Vaadi",
    artist: "Hiphop Tamizha",
    url: "Vaadi-Nee-Vaadi-MassTamilan.com.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Water Packet",
    artist: "A.R Rahman",
    url: "Water Packet.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Whistle Podu",
    artist: "Yuvan",
    url: "Whistle Podu.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Yaanji",
    artist: "Anirudh",
    url: "Yaanji-MassTamilan.com.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Yaarenna Sonnalum",
    artist: "Anirudh",
    url: "Yaarenna-Sonnalum-MassTamilan.fm.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },
  {
    title: "Yadho Ondru Ennai",
    artist: "Yuvan",
    url: "Yedho-Ondru-Ennai.mp3",
    coverUrl: "https://example.com/cover2.jpg",
  },

  //
  {
    title: "A-Love_Blossoms",
    artist: "Harrish",
    url: "A-Love-Blossoms-Instrumental.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "A-Square-B-Square",
    artist: "Harrish",
    url: "A-Square-B-Square-(Female-Version)-MassTamilan.org.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Aagaaya-Neelangalil",
    artist: "Harrish",
    url: "Aagaaya-Neelangalil-MassTamilan.fm.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Aagaya-Suriya",
    artist: "Harrish",
    url: "Aagaya-Suriyanai.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Aakaasam Nee Haddhu",
    artist: "Harrish",
    url: "Aakaasam Nee Haddhu Ra.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Thalli-Pogathey",
    artist: "A.R.Rahman",
    url: "Thalli-Pogathey.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Aaradi-Kathe",
    artist: "Harrish",
    url: "Aaradi-Kathe-MassTamilan.com.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },

  // 3 list
  {
    title: "Adhaaru-Adhaaru",
    artist: "Harrish",
    url: "Adhaaru-Adhaaru.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Adiyae-Kolluthey",
    artist: "Harrish",
    url: "Adiyae-Kolluthey-MassTamilan.com.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Akkam-Pakkam",
    artist: "Harrish",
    url: "Akkam-Pakkam.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Alaikaa-Laikaa",
    artist: "Harrish",
    url: "Alaikaa-Laikaa-MassTamilan.fm.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },

  // 4 list
  {
    title: "Alaipayauthey-Kanna",
    artist: "Harrish",
    url: "Alaipayuthey-Kanna.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Amara",
    artist: "Harrish",
    url: "Amara.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Anbe-Anbe",
    artist: "Harrish",
    url: "Anbe-Anbe.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Anbe-En-Anbe",
    artist: "Harrish",
    url: "Anbe-En-Anbe-MassTamilan.fm.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Andangkaka",
    artist: "Harrish",
    url: "Andangkaka.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Annul-Maelae",
    artist: "Harrish",
    url: "Annul-Maelae-MassTamilan.com.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  //5 list
  {
    title: "Antartica",
    artist: "Harrish",
    url: "Antartica-MassTamilan.fm.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Appappa",
    artist: "Harrish",
    url: "Appappa.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Asku-Laska",
    artist: "Harrish",
    url: "Asku-Laska-MassTamilan.fm.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Ava-Enna-Enna",
    artist: "Harrish",
    url: "Ava-Enna-Enna-MassTamilan.com.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Avalum-Naanum",
    artist: "Harrish",
    url: "Avalum-Naanum.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  // 6 list
  {
    title: "Ayyayo-Nenju",
    artist: "Harrish",
    url: "Ayyayo-Nenju.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Azhagiya-Theeye",
    artist: "Harrish",
    url: "Azhagiya-Theeye.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Bathing-At-Cannes",
    artist: "Harrish",
    url: "Bathing-At-Cannes.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Kaadhal-Yaanai",
    artist: "Harrish",
    url: "Kaadhal-Yaanai.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Kaala-Kaala",
    artist: "Harrish",
    url: "Kaala-Kaala.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Kaatuka Kanule",
    artist: "Harrish",
    url: "Kaatuka Kanule.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Chikku-Bukku",
    artist: "Harrish",
    url: "Chikku-Bukku-Chikku-MassTamilan.com.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Chillanjiukkiye",
    artist: "Harrish",
    url: "Chillanjirukkiye.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Damakku-Damakku",
    artist: "Harrish",
    url: "Damakku-Damakku-MassTamilan.dev.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  // 2 list
  {
    title: "Aararo",
    artist: "Harrish",
    url: "Aararo.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Aarumuga-Saamy",
    artist: "Harrish",
    url: "Aarumuga-Saamy.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Aasa Orave",
    artist: "Harrish",
    url: "Aasa Orave.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Aathagara-Orathil",
    artist: "Harrish",
    url: "Aathangara-Orathil.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Dama Goli",
    artist: "Harrish",
    url: "Damma Goli.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Dhimu Dhimu",
    artist: "Harrish",
    url: "Dhimu-Dhimu.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Dhinam Dhinamum",
    artist: "Harrish",
    url: "Dhinam Dhinamum.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Ellu Vaya Pookalaye",
    artist: "Harrish",
    url: "Ellu-Vaya-Pookalaye-MassTamilan.org.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "En-Anbe",
    artist: "Harrish",
    url: "En-Anbe-MassTamilan.com.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "En Friends-pola",
    artist: "Harrish",
    url: "En-Frienda-Pola-MassTamilan.fm.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },

  {
    title: "Engeyum-Kaadhal",
    artist: "Harrish",
    url: "Engeyum-Kaadhal.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Eppo-Nee",
    artist: "Harrish",
    url: "Eppo-Nee.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Fear",
    artist: "Harrish",
    url: "Fear Song.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Google-Google",
    artist: "Harrish",
    url: "Google-Google-MassTamilan.fm.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Gutkha Lakkadi",
    artist: "Harrish",
    url: "Gutkha-Lakkadi.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Hasili-Fisilye",
    artist: "Harrish",
    url: "Hasili-Fisiliye-MassTamilan.dev.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Heartiley-Battery",
    artist: "Harrish",
    url: "Heartiley-Battery-MassTamilan.fm.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Hey Minnale",
    artist: "Harrish",
    url: "Hey Minnale.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "His Name is John",
    artist: "Harrish",
    url: "His Name is John.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "horu Gali",
    artist: "Harrish",
    url: "Horu Gali.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "En-Vannilave",
    artist: "Harrish",
    url: "En-Vennilave.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Enakku-Thaan",
    artist: "Harrish",
    url: "Enakku-Thaan-MassTamilan.org.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Endhira Logathu",
    artist: "Harrish",
    url: "Endhira-Logathu-Sundhariye-MassTamilan.com.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Hunter Vantaar",
    artist: "Harrish",
    url: "Hunter Vantaar.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Idhu-Naal",
    artist: "Harrish",
    url: "Idhu-Naal.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Idhuthaanaa",
    artist: "Harrish",
    url: "Idhuthaanaa.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "InnumEnna-Thozha",
    artist: "Harrish",
    url: "Innum-Enna-Thozha.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "iru-Vizhi",
    artist: "Harrish",
    url: "Iru-Vizhi.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Irukkana-Idupu-Irukkana",
    artist: "Harrish",
    url: "Irukkana-Idupu-Irukkana-MassTamilan.fm.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Iyengaaru-Veetu-Azhage",
    artist: "Harrish",
    url: "Iyengaaru-Veetu-Azhage.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },

  {
    title: "June-Pona",
    artist: "Harrish",
    url: "June-Pona.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Kaadhal-kanmani",
    artist: "Harrish",
    url: "Kaadhal-Kanmani-MassTamilan.fm.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },

  {
    title: "kalyaanam-Thaan-Kattikittu",
    artist: "Harrish",
    url: "Kalyaanam-Thaan-Kattikittu.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Kambikara-Vetti",
    artist: "Harrish",
    url: "Kambikara-Vetti.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Kanave",
    artist: "Harrish",
    url: "Kanave.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Kanavellam",
    artist: "Harrish",
    url: "Kanavellam.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Kannadi-Nilave",
    artist: "Harrish",
    url: "Kannadi-Nilave-MassTamilan.dev.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "kannazhagu-Rathiname",
    artist: "Harrish",
    url: "Kannazhagu-Rathiname-MassTamilan.org.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Kanneer-Thuliye",
    artist: "Harrish",
    url: "Kanneer-Thuliye.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Kannum-Kannum-Nokia",
    artist: "Harrish",
    url: "Kannum-Kannum-Nokia.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Kannum-Kannum_Plus",
    artist: "Harrish",
    url: "Kannum-Kannum-Plus-MassTamilan.org.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Karu-Karu",
    artist: "Harrish",
    url: "Karu-Karu-MassTamilan.dev.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Karuppu-Nerathazhagi",
    artist: "Harrish",
    url: "Karuppu-Nerathazhagi.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Kathari-Poovazhagi",
    artist: "Harrish",
    url: "Kathari-Poovazhagi-MassTamilan.org.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Kavan",
    artist: "Harrish",
    url: "Kavan-MassTamilan.fm.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Kummiyadi-Penne",
    artist: "Harrish",
    url: "Kummiyadi-Penne-MassTamilan.com.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Kutti-pisase",
    artist: "Harrish",
    url: "Kutti-Pisase.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Kutti-Puli-Kootam",
    artist: "Harrish",
    url: "Kutti-Puli-Kootam-MassTamilan.fm.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Life-Of-Bachelor",
    artist: "Harrish",
    url: "Life-Of-Bachelor-MassTamilan.fm.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Lolita",
    artist: "Harrish",
    url: "Lolita.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Lubber Pandhu",
    artist: "Harrish",
    url: "Lubber Pandhu Theme.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Maddy-Maddy",
    artist: "Harrish",
    url: "Maddy-Maddy.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },

  {
    title: "Maja-Wedding",
    artist: "Harrish",
    url: "Maja-Wedding-MassTamilan.dev.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Makkamishi",
    artist: "Harrish",
    url: "Makkamishi.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Manasilaayo",
    artist: "Harrish",
    url: "Manasilaayo.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Manjal-Veiyil",
    artist: "Harrish",
    url: "Manjal-Veiyil.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Mazhai Mazhai",
    artist: "Harrish",
    url: "Mazhai Mazhai.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Mella-Velanjadhu",
    artist: "Harrish",
    url: "Mella-Valanjadhu.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  // continue for title
  {
    title: "Miss-You-Baby",
    artist: "Harrish",
    url: "Miss-You-Baby-MassTamilan.fm.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Moongil-Kaadugale",
    artist: "Harrish",
    url: "Moongil-Kaadugale.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Mun-Andhi",
    artist: "Harrish",
    url: "Mun-Andhi.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Mundhinam-Parhene",
    artist: "Harrish",
    url: "Mundhinam-Parthene-MassTamilan.com.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "my-Dear-Loveru",
    artist: "Harrish",
    url: "My-Dear-Loveru-MassTamilan.com.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "My-Dear-Pondatti",
    artist: "Harrish",
    url: "My-Dear-Pondatti-MassTamilan.dev.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Nalla-Nanban",
    artist: "Harrish",
    url: "Nalla-Nanban-MassTamilan.fm.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Naggai",
    artist: "Harrish",
    url: "Nangaai.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Nenjai-Poopol",
    artist: "Harrish",
    url: "Nenjai-Poopol.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Nenjellam-Nindrayee",
    artist: "Harrish",
    url: "Nenjellam-Nindrayae-MassTamilan.org.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Nenjil-Nenjil",
    artist: "Harrish",
    url: "Nenjil-Nenjil.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Nenjodu-Nee-(Female)",
    artist: "Harrish",
    url: "Nenjodu-Nee-(Female)-MassTamilan.dev.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Nerupae",
    artist: "Harrish",
    url: "Nerupae.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Moorandhu-Kathale",
    artist: "Harrish",
    url: "Noorandu-Kathale-MassTamilan.com.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Oh Maname",
    artist: "Harrish",
    url: "Oh Maname.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "oh-Balu",
    artist: "Harrish",
    url: "Oh-Balu-MassTamilan.org.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Oh-Mama-Mama",
    artist: "Harrish",
    url: "Oh-Mama-Mama.mp33",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Oh-Ringa-Ringa",
    artist: "Harrish",
    url: "Oh-Ringa-Ringa.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Oh-Shanthi-shanthi",
    artist: "Harrish",
    url: "Oh-Shanthi-Shanthi-MassTamilan.com.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Oh-Sukumari",
    artist: "Harrish",
    url: "Oh-Sukumari.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Okka Nimisham",
    artist: "Harrish",
    url: "Okka Nimisham.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Oorellam-Unnai-Kandu",
    artist: "Harrish",
    url: "Oorellam-Unnai-Kandu.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Oru-Maalai",
    artist: "Harrish",
    url: "Oru-Maalai.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },

  {
    title: "Pachai-Uduthiya-Kaadu",
    artist: "Harrish",
    url: "Pachai-Uduthiya-Kaadu.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Pachigalam-Paravaigalam",
    artist: "Harrish",
    url: "Pachigalam-Paravaigalam-MassTamilan.fm.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Pattha-Muthal",
    artist: "Harrish",
    url: "Partha-Muthal.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Pilla Puli",
    artist: "Harrish",
    url: "Pilla Puli.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Poi-Varavaa",
    artist: "Harrish",
    url: "Poi-Varavaa-MassTamilan.fm.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Polladha-Boomi",
    artist: "Harrish",
    url: "Polladha-Boomi-MassTamilan.org.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Pooppol-poopol",
    artist: "Harrish",
    url: "Pooppol-Poopol.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Por Veeran",
    artist: "Harrish",
    url: "Por Veeran (Azadi).mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Poraen Naa Poraen",
    artist: "Harrish",
    url: "Poraen Naa Poraen.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Porkkalam",
    artist: "Harrish",
    url: "Porkkalam-Tamil-Rap.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "pudichirukku",
    artist: "Harrish",
    url: "Pudichirukku.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Pullinangal",
    artist: "Harrish",
    url: "Pullinangal-MassTamilan.com.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Raajali-Nee-Gaali",
    artist: "Harrish",
    url: "Raajali-Nee-Gaali-MassTamilan.com.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Oru-Vaanam",
    artist: "Harrish",
    url: "Oru-Vaanam-MassTamilan.org.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Oru-Vazhi",
    artist: "Harrish",
    url: "Oru-Vazhi-Pathai-MassTamilan.com.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Otha-Sollala",
    artist: "Harrish",
    url: "Otha-Sollaala.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Othayilae",
    artist: "Harrish",
    url: "Othayilae.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Ragasiyam-",
    artist: "Harrish",
    url: "Ragasiyam-MassTamilan.com.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Rahatulla",
    artist: "Harrish",
    url: "Rahatulla.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Rangola",
    artist: "Harrish",
    url: "Rangola.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Rasaali",
    artist: "Harrish",
    url: "Rasaali.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },

  {
    title: "Sakhiyae",
    artist: "Harrish",
    url: "Sakhiyae.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Sawadeeka",
    artist: "Aniruth",
    url: "Sawadeeka-MassTamilan.dev.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Showkali",
    artist: "Harrish",
    url: "Showkali.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Silu-Silu",
    artist: "Harrish",
    url: "Silu-Silu.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Sithramaina",
    artist: "Harrish",
    url: "Sithramaina Bhoomi.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Sleeping-Beauty",
    artist: "Harrish",
    url: "Sleeping-Beauty-MassTamilan.dev.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Suttum-Vizhi",
    artist: "Harrish",
    url: "Suttum-Vizhi.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },

  {
    title: "that-Is-Mahalaksmi",
    artist: "Harrish",
    url: "That-Is-Mahalakshmi-MassTamilan.org.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "The-Blood-Bath",
    artist: "Harrish",
    url: "The-Blood-Bath-MassTamilan.org.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "The-raise-of-Damo",
    artist: "Harrish",
    url: "The-Rise-of-Damo.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Thee-Illai",
    artist: "Harrish",
    url: "Thee-Illai.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Thiru-Thiru-Ganantha",
    artist: "Harrish",
    url: "Thiru-Thiru-Gananatha-MassTamilan.org.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Thirunelveli-Alvada",
    artist: "Harrish",
    url: "Thirunelveli-Alvada.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Thotta-Power",
    artist: "Harrish",
    url: "Thotta-Power.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "thalaivane",
    artist: "Harrish",
    url: "Thalaivane-MassTamilan.dev.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Thalavali",
    artist: "Harrish",
    url: "Thalavali-MassTamilan.dev.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Unakkena-Venum-Sollu",
    artist: "Harrish",
    url: "Unakkenna-Venum-Sollu.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "unakkul-Naane",
    artist: "Harrish",
    url: "Unakkul-Naane-MassTamilan.dev.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Unnaale-Unnaale",
    artist: "Harrish",
    url: "Unnaale-Unnaale.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Uyirey",
    artist: "uyiey",
    url: "Uyirey.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Vaane Vaane",
    artist: "Harrish",
    url: "Vaane Vaane.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },

  {
    title: "Vaseegara",
    artist: "Harrish",
    url: "Vaseegara.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Veeramulla",
    artist: "Harrish",
    url: "Veeramulla.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Venmathiye",
    artist: "Harrish",
    url: "Venmathiye.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Veenilave",
    artist: "Harrish",
    url: "Vennilave-MassTamilan.fm.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "RVaarayo-Varaayo",
    artist: "Harrish",
    url: "Vaarayo-Vaarayo-MassTamilan.dev.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Vandhuttaanda-kaalai",
    artist: "Harrish",
    url: "Vandhuttaanda-Kaalai.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Vennilavu Saaral",
    artist: "Harrish",
    url: "Vennilavu Saaral.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Veppamaram",
    artist: "Harrish",
    url: "Veppamaram.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Verenna-Verenna",
    artist: "Harrish",
    url: "Verenna-Verenna.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Vilaiyaadu-Vilayaadu",
    artist: "Harrish",
    url: "Vilaiyaadu-Vilaiyaadu.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },

  {
    title: "Yamma-Yamma",
    artist: "Harrish",
    url: "Yamma-Yamma.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Yathe-yathe",
    artist: "Harrish",
    url: "Yathe-Yathe.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Yeanadi-Yeanadi",
    artist: "Harrish",
    url: "Yeanadi-Yeanadi-MassTamilan.org.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Yellae-lama",
    artist: "Harrish",
    url: "Yellae-Lama.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Yen-Minukki",
    artist: "Harrish",
    url: "Yen-Minukki-MassTamilan.org.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Yendhan-Kan-Mune",
    artist: "Harrish",
    url: "Yendhan-Kan-Munne-MassTamilan.fm.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Yethi-Yethi",
    artist: "Harrish",
    url: "Yethi-Yethi-MassTamilan.com.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Vizhiyil-Un-Vizhiyil",
    artist: "Harrish",
    url: "Vizhiyil-Un-Vizhiyil.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "Warriors-English",
    artist: "Harrish",
    url: "Warriors-English-Rap.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  },
  {
    title: "X-Machi",
    artist: "Harrish",
    url: "X-Machi.mp3",
    coverUrl: "https://example.com/cover1.jpg",
  }
];

let currentSongIndex = 0;
let isPlaying = false;
const audio = new Audio();
const trackList = document.getElementById('trackList');
const searchInput = document.getElementById('search');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const cover = document.getElementById('cover');
const playPauseButton = document.getElementById('playPause');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const progress = document.getElementById('progress');
const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');
const volume = document.getElementById('volume');

const loadSong = (index) => {
  const song = SONGS[index];
  title.textContent = song.title;
  artist.textContent = song.artist;
  audio.src = song.url;
  progress.value = 0;
  currentTimeDisplay.textContent = "0:00";
  durationDisplay.textContent = "0:00";
  updateMediaSession(song);

  // Try to extract cover image from MP3 metadata
  fetch(song.url)
    .then(response => response.blob())
    .then(blob => {
      jsmediatags.read(blob, {
        onSuccess: function (tag) {
          const picture = tag.tags.picture;
          if (picture) {
            let base64String = "";
            for (let i = 0; i < picture.data.length; i++) {
              base64String += String.fromCharCode(picture.data[i]);
            }
            const base64 = btoa(base64String);
            cover.src = `data:${picture.format};base64,${base64}`;
          } else {
            cover.src = song.coverUrl || "default-cover.jpg"; // Use array cover or fallback
          }
        },
        onError: function (error) {
          console.error("Error reading cover art:", error);
          cover.src = song.coverUrl || "default-cover.jpg"; // Use array cover or fallback
        }
      });
    })
    .catch(error => {
      console.error("Error fetching MP3 file:", error);
      cover.src = song.coverUrl || "default-cover.jpg"; // Use array cover or fallback
    });
};

// Play the current song
const playSong = () => {
  isPlaying = true;
  audio.play();
  playPauseButton.textContent = '⏸️';
};

// Pause the current song
const pauseSong = () => {
  isPlaying = false;
  audio.pause();
  playPauseButton.textContent = '▶️';
};

// Toggle play/pause
const togglePlayPause = () => {
  isPlaying ? pauseSong() : playSong();
};

// Play the next song
const playNextSong = () => {
  currentSongIndex = (currentSongIndex + 1) % SONGS.length;
  loadSong(currentSongIndex);
  playSong();
};

// Play the previous song
const playPrevSong = () => {
  currentSongIndex = (currentSongIndex - 1 + SONGS.length) % SONGS.length;
  loadSong(currentSongIndex);
  playSong();
};

// Update the progress bar and time display
const updateProgress = () => {
  const { currentTime, duration } = audio;
  progress.value = (currentTime / duration) * 100 || 0;
  currentTimeDisplay.textContent = formatTime(currentTime);
  durationDisplay.textContent = formatTime(duration);
};

// Format time for display
const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

// Handle seeking through the progress bar
const handleSeek = (e) => {
  const seekTime = (e.target.value / 100) * audio.duration;
  audio.currentTime = seekTime;
};

// Update WebViewString to prevent App Inventor from stopping
updateAppInventorState("Playing: " + SONGS[currentSongIndex].title + " - " + Math.floor(audio.currentTime) + "s");

// Update the volume
const updateVolume = (e) => {
  audio.volume = e.target.value / 100;
};

// Filter the song list based on the search input
const filterSongs = () => {
  const query = searchInput.value.toLowerCase();
  const filteredSongs = SONGS.filter((song) => song.title.toLowerCase().includes(query));
  renderSongList(filteredSongs);
};

// Render the song list in the UI
const renderSongList = (songs) => {
  trackList.innerHTML = '';
  songs.forEach((song) => {
    const li = document.createElement('li');
    li.textContent = `${song.title} - ${song.artist}`;
    li.classList.add('track');
    li.addEventListener('click', () => {
      const songIndex = SONGS.findIndex((s) => s.title === song.title);
      currentSongIndex = songIndex;
      loadSong(currentSongIndex);
      playSong();
    });
    trackList.appendChild(li);
  });
};
// Function to update media session metadata and send status to App Inventor
const updateMediaSession = (song) => {
  if ('mediaSession' in navigator) {
    // Default to provided coverUrl or a fallback image
    let artworkUrl = song.coverUrl || "default-cover.jpg";

    // Try extracting embedded cover art from MP3 metadata
    fetch(song.url)
      .then(response => response.blob())
      .then(blob => {
        jsmediatags.read(blob, {
          onSuccess: (tag) => {
            const picture = tag.tags.picture;
            if (picture) {
              let base64String = "";
              for (let i = 0; i < picture.data.length; i++) {
                base64String += String.fromCharCode(picture.data[i]);
              }
              artworkUrl = `data:${picture.format};base64,${btoa(base64String)}`;
            }

            // Update media session with extracted or fallback artwork
            navigator.mediaSession.metadata = new MediaMetadata({
              title: song.title,
              artist: song.artist,
              album: song.album || "Unknown Album",
              artwork: [{ src: artworkUrl, sizes: "512x512", type: "image/png" }]
            });

            // Send update to App Inventor
            updateAppInventorWithMediaSessionStatus(`Metadata Updated: ${song.title}`);
          },
          onError: (error) => {
            console.error("Error extracting metadata:", error);

            // Use fallback cover if metadata extraction fails
            navigator.mediaSession.metadata = new MediaMetadata({
              title: song.title,
              artist: song.artist,
              album: song.album || "Unknown Album",
              artwork: [{ src: artworkUrl, sizes: "512x512", type: "image/png" }]
            });

            updateAppInventorWithMediaSessionStatus(`Metadata Updated: ${song.title} (No Cover Found)`);
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching MP3 file:", error);

        // Use fallback cover if fetching fails
        navigator.mediaSession.metadata = new MediaMetadata({
          title: song.title,
          artist: song.artist,
          album: song.album || "Unknown Album",
          artwork: [{ src: artworkUrl, sizes: "512x512", type: "image/png" }]
        });

        updateAppInventorWithMediaSessionStatus(`Metadata Updated: ${song.title} (Failed to Fetch)`);
      });
  }
};

// Ensure playback continues after screen is off
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    playSong();
  }

});

// Event listeners for audio and controls
audio.addEventListener('ended', playNextSong);
audio.addEventListener('timeupdate', updateProgress);
searchInput.addEventListener('input', filterSongs);
playPauseButton.addEventListener('click', togglePlayPause);
nextButton.addEventListener('click', playNextSong);
prevButton.addEventListener('click', playPrevSong);
progress.addEventListener('input', handleSeek);

// Initial setup
loadSong(currentSongIndex);
renderSongList(SONGS);
