import styles from './styles.module.scss';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../utils/ConvertDurationToTimeString';

 export function Player() { // Páginas dentro de pages precisam do default. aqui desnecessário e facilita indexação na importação via VsCode.
    const audioRef = useRef<HTMLAudioElement>(null); // Ref serve para referenciar elementos HTML como a tag audio. inicializado como nulo por ainda não tem áudio adicionado na playlist.
    const[progress, setProgress] = useState(0);

    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        isLooping,
        isShuffling,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        playNext,
        playPrevious, 
        hasNext,
        hasPrevious,
        clearPlayerState
    } = usePlayer();

    useEffect(() => { // Toda vez que o isPlaying muda dispara aqui.
        if(!audioRef.current) {
            return;
        }

        if(isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying])

    function setupProgressListener() {
        audioRef.current.currentTime = 0;
        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        });
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnded() {
        if (hasNext) {
            playNext()
        } else {
            clearPlayerState()
        }
    }

    const episode = episodeList[currentEpisodeIndex] 

    return (
        <div className={styles.playerContainer}>
            <header>
                <Image
                    src="/playing.svg"
                    alt="Tocando agora"
                    width={50}
                    height={50}
                />
                <strong>Tocando agora</strong>
            </header>  

            { episode ? (
                <div className={styles.currentEpisode}>
                    <Image 
                        width={592} 
                        height={592} 
                        src={episode.thumbnail} 
                        objectFit="cover" 
                    />
                    <strong>{episode.title}</strong>
                    <strong>{episode.members}</strong>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            ) }


            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>


                    <div className={styles.slider}>
                        { episode ? (
                            <Slider 
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{ backgroundColor: '#84d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#84d361', borderWidth: 4 }}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        ) }
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                { episode && (
                    <audio
                        src={episode.url}
                        ref={audioRef}
                        autoPlay
                        loop={isLooping}
                        onEnded={handleEpisodeEnded}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onLoadedMetadata={setupProgressListener}
                    />
                )}

                <div className={styles.buttons}>
                        <button 
                            type="button" 
                            disabled={!episode || episodeList.length == 1}
                            onClick={toggleShuffle}
                            className={isShuffling ? styles.isActive : ''} 
                        >
                        <Image
                            src="/shuffle.svg"
                            alt="Embaralhar"
                            width={25}
                            height={25} 
                        />
                    </button>
                    <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
                        <Image
                            src="/play-previous.svg"
                            alt="Tocar anterior"
                            width={25}
                            height={25}
                        />                        
                    </button>
                    <button 
                        type="button" 
                        className={styles.playButton} 
                        disabled={!episode}
                        onClick={togglePlay}
                    >
                        { isPlaying ? 
                            <Image 
                                src="/pause.svg"
                                alt="Pausar"
                                width={25}
                                height={25}
                            /> 
                            : 
                            <Image
                                src="/play.svg"
                                alt="Tocar"
                                width={25}
                                height={25}
                            />  
                        }       
                    </button>
                    <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                        <Image
                            src="/play-next.svg"
                            alt="Tocar próximo"
                            width={25}
                            height={25}
                        />   
                    </button>
                    <button 
                        type="button" 
                        disabled={!episode}
                        onClick={toggleLoop}
                        className={isLooping ? styles.isActive : ''}    
                    >
                        <Image
                            src="/repeat.svg"
                            alt="Repetir"
                            width={25}
                            height={25}
                        />
                    </button>
                </div>
            </footer>
        </div>
    );
 }