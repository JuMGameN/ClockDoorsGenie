
import { GeniesThirdPersonController, StarterAssetsInputs } from "StarterAssets";
import { AudioClip, AudioSource, Time, MonoBehaviour } from "UnityEngine";
export default class FootstepAudio extends MonoBehaviour {

    footstepSounds: AudioClip[];
    jumpSound: AudioClip;
    landSound: AudioClip;
    stepInterval: number = 0.5;
    private stepTimer: number = 0;
    audioSource: AudioSource;
    private isGrounded: boolean = true;
    playerStarterAssetsInputs: StarterAssetsInputs;
    playerGeniesThirdPersonController: GeniesThirdPersonController;
    private jumpSoundPlayed: boolean = false;
    private landSoundPlayed: boolean = true;

    private Update(): void {
        const velocity = this.playerStarterAssetsInputs.move.x + this.playerStarterAssetsInputs.move.y;
        this.isGrounded = this.playerGeniesThirdPersonController.Grounded;

        if (this.isGrounded && velocity != 0) {
            this.stepTimer += Time.deltaTime;

            if (this.stepTimer >= this.stepInterval) {
                this.playFootstepSound();
                this.stepTimer = 0;
            }
            this.jumpSoundPlayed = false;
        }

        if (this.isGrounded && !this.landSoundPlayed) {
            this.playLandSound();
            this.jumpSoundPlayed = false;
            this.landSoundPlayed = true;
        }
    }

    playFootstepSound() {
        if (this.footstepSounds.length > 0) {
            const randomIndex = Math.floor(Math.random() * this.footstepSounds.length);
            const randomClip = this.footstepSounds[randomIndex];

            this.audioSource.clip = randomClip;
            this.audioSource.Play();
        }
    }


    playLandSound() {
        this.audioSource.clip = this.landSound;
        this.audioSource.Play();
    }
}

