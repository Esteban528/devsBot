const { createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice');

module.exports = (client) => {
    const audioPlayer = createAudioPlayer();

    audioPlayer.on('error', (error) => {
        console.error(`Error en el reproductor de audio: ${error.message}`);
    });

    audioPlayer.on(AudioPlayerStatus.Idle, () => {
        console.log('El reproductor de audio está inactivo');
    });

    client.audioPlayer = audioPlayer;
};


