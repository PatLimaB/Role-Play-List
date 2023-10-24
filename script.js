// Seleccionar los elementos del reproductor de música y de la interfaz
let songImageElement = document.getElementById("songImage");
let buttons = document.getElementsByClassName("button"); // Obtenemos un array con todos los botones de la consola
let loopButtonElement = buttons[0];
let backButtonElement = buttons[1];
let playButtonElement = buttons[2];
let forwardButtonElement = buttons[3];
let randomButtonElement = buttons[4];
let durationElement = document.getElementById("duration");
let songItems = document.querySelectorAll('.songItem'); // Obtenemos un array con todos los songItem, que son los títulos de cada canción a los que se les podrá hacer clic para cambiar la canción
let bodyElement = document.querySelector("body");
let titleElement = document.getElementById("showTitle");
let currentTimeElement = document.getElementById('currentTime');
let totalTimeElement = document.getElementById('totalTime');

// Obtenemos los elementos de audio y los almacenamos en un array
const songs = [
    document.getElementById("song1"),
    document.getElementById("song2"),
    document.getElementById("song3")
];

// Array de rutas de imágenes correspondientes a las canciones
const songImages = [
    './img/backgrounds/chibiTavern.jpg',
    './img/backgrounds/chibiMarket.jpg',
    './img/backgrounds/chibiBattle.jpg'
];

// Array de rutas de imágenes correspondientes a las canciones
const songBackgrounds = [
    './img/backgrounds/backgroundTavern.png',
    './img/backgrounds/backgroundMarket.png',
    './img/backgrounds/backgroundEpicFight.png'
];

// Array de los títulos de las canciones
const songTitles = [
    'Tavern',
    'Market',
    'Epic Fight'
];

// Variables de control
let currentSongIndex = 0; // Índice de la canción actual
let isLooping = false; // Boolean para saber si la canción está en bucle
let isRandom = false; // Boolean para saber si la reproducción está en aleatorio
let songDuration;   
let currentSong;
let currentTime;

// Función para reproducir la canción actual y cambiar al siguiente elemento del array
function reproducirCancion(index) {
    if (currentSong) {
        pauseSong();
        currentSong.currentTime = 0;
    }

    currentSongIndex = index;
    currentSong = songs[currentSongIndex];

    if (isLooping) {
        currentSong.loop = true;
    } else {
        currentSong.loop = false;
    }

    playSong();
    // Cambiamos las imágenes asociadas a la canción y el título que se muestra
    changeSongImage();
    changeBackgroundImage();
    changeTitle();
}

// Función para reproducir la canción
function playSong() {
    currentSong.play();
    playButtonElement.src = "./img/icons/pause.png";

    // Cambiamos las imágenes asociadas a la canción y el título que se muestra
    changeSongImage();
    changeBackgroundImage();
    changeTitle();
}

// Función para pausar la canción
function pauseSong() {
    currentSong.pause();
    playButtonElement.src = "./img/icons/play.png";
}

// Agregamos un event listener al botón de reproducción
playButtonElement.addEventListener('click', () => {
    currentSong = songs[currentSongIndex];
    if (currentSong.paused) {
        playSong();
    } else {
        pauseSong();
    }

});

// Función para cambiar el icono a play al finalizar la canción
songs.forEach((song) => {
    song.addEventListener('ended', () => {
        if (isLooping) {
            songs[currentSongIndex].currentTime = 0; // Reiniciamos el tiempo de reproducción al principio si el modo de bucle está activado
            songs[currentSongIndex].play(); // Reproducimos la canción actual en bucle
        } else {
            if (isRandom) {
                changeToNextSong(); // Cambiamos a la siguiente canción aleatoria si el modo aleatorio está activado
            } else {
                changeToNextSong(); // Cambiamos a la siguiente canción si el modo aleatorio no está activado
            }
        }
    });
});

// Para mostrar el valor del tiempo actual de la canción y su duración total, tendremos que formatear el tiempo:
function formatTime (time) {
    let minutes = Math.floor(time/60);
    let seconds = Math.floor(time%60);

    //Mantenemos el formato de dos dígitos de los segundos de la siguiente manera:
    if (seconds>10){
        return `${minutes}:${seconds}`;
    } else {
        return `${minutes}:0${seconds}`;
    }
}

// Función para actualizar el input range con el tiempo de la canción
function actualizarTiempoCancion() {
    currentSong = songs[currentSongIndex];
    songDuration = currentSong.duration;
    currentTime = currentSong.currentTime;
    durationElement.value = (currentTime / songDuration) * 100; // Introducimos el porcentaje en el value, ya que este va de 1 a 100

    //Mostramos el tiempo actual y la duración de la canción actual
    currentTimeElement.innerText = formatTime(currentTime);
    currentTimeElement.classList.remove("hidden");
    totalTimeElement.innerText = formatTime(songDuration);
    totalTimeElement.classList.remove("hidden");

}

// Agregamos un event listener para actualizar el tiempo de la canción
songs.forEach(song => {
    song.addEventListener('timeupdate', actualizarTiempoCancion);
});

// Función para cambiar el tiempo de la canción según el valor de la barra de reproducción
durationElement.addEventListener('input', () => {
    currentSong = songs[currentSongIndex];
    songDuration = currentSong.duration;
    let selectedTime = (durationElement.value / 100) * songDuration;
    currentSong.currentTime = selectedTime;
});

// Función para cambiar a la siguiente canción en la lista
function changeToNextSong() {
    songs[currentSongIndex].pause(); // Pausamos la canción actual
    songs[currentSongIndex].currentTime = 0; // Reiniciamos el tiempo de reproducción al principio

    if (isLooping) {
        songs[currentSongIndex].play(); // Reproducimos la canción actual en bucle si el modo de bucle está activado
    } else {
        if (isRandom) {
            let randomIndex = currentSongIndex;
            while (randomIndex === currentSongIndex) {
                randomIndex = Math.floor(Math.random() * songs.length); // Obtenemos un índice aleatorio diferente al actual
            }
            currentSongIndex = randomIndex; // Establecemos el índice actual como el índice aleatorio
            songs[currentSongIndex].play(); // Reproducimos la siguiente canción aleatoria
        } else {
            currentSongIndex = (currentSongIndex + 1) % songs.length; // Cambiamos al siguiente índice de canción y nos aseguramos de que el índice permanezca dentro del rango del array
            songs[currentSongIndex].play(); // Reproducimos la siguiente canción
        }
    }
    changeSongImage();
    changeBackgroundImage();
    changeTitle();
}

// Función para cambiar a la canción anterior en la lista
function changeToPreviousSong() {
    songs[currentSongIndex].pause(); // Pausamos la canción actual
    songs[currentSongIndex].currentTime = 0; // Reiniciamos el tiempo de reproducción al principio
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length; // Cambiamos al siguiente índice de canción y nos aseguramos de que el índice permanezca dentro del rango del array
    songs[currentSongIndex].play(); // Reproducimos la canción anterior
    changeSongImage();
    changeBackgroundImage();
    changeTitle();
}

// Agregamos event listeners a los botones de avance y retroceso
forwardButtonElement.addEventListener('click', changeToNextSong);
backButtonElement.addEventListener('click', changeToPreviousSong);

// Event listener para el botón de bucle
loopButtonElement.addEventListener('click', () => {
    isLooping = !isLooping; // Cambiamos el estado del bucle al hacer clic en el botón de bucle
    if (isLooping) {
        loopButtonElement.style.opacity = "0.5"; // Reducimos la opacidad de la imagen del botón de bucle cuando el bucle está activado
    } else {
        loopButtonElement.style.opacity = "1"; // Reestablecemos la opacidad de la imagen a su estado original cuando el bucle no está activado
    }
});

// Event listener para el botón de reproducción aleatoria
randomButtonElement.addEventListener('click', () => {
    isRandom = !isRandom; // Cambiamos el estado de reproducción aleatoria al hacer clic en el botón de reproducción aleatoria
    if (isRandom) {
        randomButtonElement.style.opacity = "0.5"; // Reducimos la opacidad de la imagen del botón aleatorio cuando la reproducción aleatoria está activada
    } else {
        randomButtonElement.style.opacity = "1"; // Reestablecemos la opacidad de la imagen a su estado original cuando la reproducción aleatoria no está activada
    }
});

// Función para cambiar la imagen de la canción según el título de la canción
function changeSongImage() {
    songImageElement.src = songImages[currentSongIndex];
}

// Función para cambiar el fondo junto con la canción
function changeBackgroundImage() {
    if (currentSongIndex === 0) {
        bodyElement.style.backgroundImage = `url(${songBackgrounds[0]})`;
    } else if (currentSongIndex === 1) {
        bodyElement.style.backgroundImage = `url(${songBackgrounds[1]})`;
    } else if (currentSongIndex === 2) {
        bodyElement.style.backgroundImage = `url(${songBackgrounds[2]})`;
    }
}

// Función para que se vaya modificando el título de la canción
function changeTitle() {
    if (currentSongIndex === 0) {
        titleElement.innerText = songTitles[0];
    } else if (currentSongIndex === 1) {
        titleElement.innerText = songTitles[1];
    } else if (currentSongIndex === 2) {
        titleElement.innerText = songTitles[2];
    }
}

// Agregamos event listeners a cada elemento de canción (la lista de canciones que queda a la izquierda de la pantalla)
songItems.forEach((songItem, index) => {
    songItem.addEventListener('click', () => {
        let songImageSrc = '';

        changeSongImage();
        changeBackgroundImage();
        changeTitle();

        songImageElement.src = songImageSrc; // Establecemos la imagen de la canción

        // Reproducimos la canción seleccionada
        reproducirCancion(index);
    });
});
