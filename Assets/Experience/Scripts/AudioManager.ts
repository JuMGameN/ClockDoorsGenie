
import { AudioSource, MonoBehaviour } from "UnityEngine";
import Sound from "./Sound";
import { AudioMixer } from "UnityEngine.Audio";
export default class AudioManager extends MonoBehaviour {

    audioMixer: AudioMixer;
    musicSource: AudioSource;
    sfxSource: AudioSource;
    musicSounds: Sound[];
    sfxSounds: Sound[];
    isMuted: bool = false;
    currentSFXClip: Sound;

    @NonSerialized public static Instance: AudioManager;
    Awake() {
        //Establishes the GameManager singleton instance
        if (AudioManager.Instance == null) {
            AudioManager.Instance = this;
        } else {
            AudioManager.Destroy(this.gameObject);
        }
    }
    private Start() {
        this.playMusic("Theme");
    }
    playMusic(clipToPlay: string): void {
        const sMusic = this.musicSounds.find(s => s.nameSound === clipToPlay);

        if (sMusic) {
            this.musicSource.clip = sMusic.clipSound;
            this.musicSource.Play();

        } else {
            console.log("Music Sound Not Found.");
        }
    }

    playSFX(clipToPlay: string): void {
        this.currentSFXClip = this.sfxSounds.find(s => s.nameSound === clipToPlay);

        if (this.currentSFXClip) {
            this.sfxSource.PlayOneShot(this.currentSFXClip.clipSound);
        } else {
            console.log("SFX Sound Not Found.");
        }
    }

    muteAll(): void {
        this.isMuted = !this.isMuted;
        const muteVolume = this.isMuted ? -80 : 0;
        this.audioMixer.SetFloat("MasterVolume", muteVolume);
    }
    public isAllMuted(): boolean {
        return this.isMuted;
    }

    public isSFXPlaying(soundName: string): boolean {
        return this.currentSFXClip.nameSound === soundName && this.sfxSource.isPlaying;
    }
}
