import surats from "./surarts.js";

let constainer = document.querySelector(".container");

let playBtn = document.querySelector("button");
let text = document.querySelector(".content_texte");
let from = document.querySelector("#from");
let to = document.querySelector("#to");
let surah = document.querySelector("#surah");
let curent_surat = document.querySelector(".curent_surat");

let audio;
let currentAudio = 0;
let isPlaying = false;
let optionTag = "";
let ayah = 0;
let ayahEnd = 0;
let prevStartAyah;
let prevEndAyah;

// insert surats option
function insertSouratOption() {
  for (let i = 1; i <= 114; i++) {
    optionTag += `<option value="s${i}">Surah ${i} </option>`;
  }
  surah.insertAdjacentHTML("beforeend", optionTag);
}
insertSouratOption();

//slect surats
surah.addEventListener("change", () => {
  let maxLength = surats[surah.value];
  from.max = maxLength;
  to.max = maxLength;
  to.value = maxLength;
  from.value = '1'
  isPlaying = false
});

// get texte coran by fetvhing api
function coranText(n) {
  text.innerText = "";
  fetch(`http://api.alquran.cloud/v1/ayah/${n}`)
    .then((result) => result.json())
    .then((data) => {
      let currentAyah = data.data.text;
      text.innerText = currentAyah;
      curent_surat.innerText = data.data.surah.englishName;
    });
}

playBtn.addEventListener("click", () => {
  if (constainer.classList.contains("disable")) {
    isPlaying = true;
}else {  
    isPlaying = false

  }
  if (surah.value === "s1") {
    ayah = parseFloat(from.value);
    ayahEnd = parseFloat(to.value);
    prevStartAyah = parseFloat(from.value);
    prevEndAyah = parseFloat(to.value);
  } else {
    ayah = convertManualSelectFrom();
    ayahEnd = convertManualSelectTo();
    prevStartAyah = convertManualSelectFrom();
    prevEndAyah = convertManualSelectTo();
  }
  playAayah()
});

// lire les ayats selectioonés
function playAayah() {
  if (ayah >= ayahEnd) {
    ayah = prevStartAyah;
    currentAudio = 0;
  }
  ayah += currentAudio;

  if (isPlaying) {
    audio.pause();
    audio.ended;
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    constainer.classList.remove("disable");
    currentAudio = 0
    return isPlaying = false;
    
  } else {
    coranText(ayah);
    audio = new Audio(
      `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah}.mp3`
    );
    audio.play();
    playBtn.innerHTML = '<i class="fa-solid fa-square"></i>';
    constainer.classList.add("disable");
    audio.addEventListener("ended", () => {
      currentAudio = 1;
      playAayah(ayah);
    });
  }
}

function convertManualSelectFrom() {
  let total = 0;
  for (let surat in surats) {
    if (surat === surah.value) {
      break;
    }
    total += surats[surat];
  }
  return total + parseFloat(from.value);
}

function convertManualSelectTo() {
  let total = 0;
  for (let surat in surats) {
    if (surat === surah.value) {
      break;
    }
    total += surats[surat];
  }
  return total + parseFloat(to.value);
}
