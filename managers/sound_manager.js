function SoundManager() {
    this.sounds = {};
    this.music = null;
    this.isPlaying = false;
    this.maxPlaybackRate = 160 / 90;
    this.playbackSpeed = 1.0;
}

SoundManager.prototype.loadSound = function (name, url) {
    const audio = new Audio(url);
    this.sounds[name] = audio;
};

SoundManager.prototype.playSound = function (name) {
    if (this.sounds[name]) {
        this.sounds[name].currentTime = 0;
        this.sounds[name].play().catch((error) => {
            console.error("Error playing sound:", error);
        });
    } else {
        console.warn(`Sound ${name} not loaded!`);
    }
};

SoundManager.prototype.increasePlaybackRate = function (amount) {
    if(this.playbackSpeed < this.maxPlaybackRate) {
        this.playbackSpeed += amount;
    }
    else {
        this.playbackSpeed = this.maxPlaybackRate;
    }
    this.music.playbackRate = this.playbackSpeed;
};


SoundManager.prototype.loadMusic = function (url) {
    this.music = new Audio(url);
    this.music.loop = true;
};

SoundManager.prototype.playMusic = function () {
    if (this.music) {
        this.music.currentTime = 0;
        this.music.play().catch((error) => {
            console.error("Error playing music:", error);
        });
        this.isPlaying = true;
    } else {
        console.warn("Music not loaded!");
    }
};

SoundManager.prototype.pauseMusic = function () {
    if (this.music) {
        this.music.pause();
    }
};

SoundManager.prototype.stopMusic = function () {
    if (this.music) {
        this.music.pause();
        this.music.currentTime = 0;
        this.isPlaying = false;
        this.playbackSpeed = 1.0;
    }
};

SoundManager.prototype.setSoundVolume = function (volume) {
    for (const sound in this.sounds) {
        if (this.sounds.hasOwnProperty(sound)) {
            this.sounds[sound].volume = volume;
        }
    }
};

SoundManager.prototype.setMusicVolume = function (volume) {
    if (this.music) {
        this.music.volume = volume;
    }
};