
import { GeniesThirdPersonController } from "StarterAssets";
import { Time, Mathf, MonoBehaviour, Collider, Event } from "UnityEngine";
import AudioManager from "./AudioManager";
import TimerManager from "./TimerManager";
import ScoreManager from "./ScoreManager";
import GameManager, { GameState } from "./GameManager";
export default class PlayerStaminaManager extends MonoBehaviour {

    onStaminaChange: GeniesEvent<[number]> = new GeniesEvent<[number]>();
    onStaminaEnd: GeniesEvent = new GeniesEvent();
    onPlayerFall: GeniesEvent = new GeniesEvent();

    private characterController: GeniesThirdPersonController;

    stamina: number = 100;
    private maxStamina: number = 100;
    private minStamina: number = 0;
    staminaDrainRate: number = 5;  // Stamina lost per second when climbing
    staminaRegenRate: number = 3;  // Stamina gained per second when going down
    flatGroundRegenRate: number = 1; // Stamina gained on flat ground
    normalSpeed: number = 5;
    tiredSpeed: number = 2;
    currentSpeed: number;
    private inRestArea: boolean = false;
    private lastPositionY: number;
    private lastPlayedSFX: string;
    isInDeathArea: boolean = false;

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start(): void {
        this.currentSpeed = this.normalSpeed;
        this.characterController = this.GetComponent<GeniesThirdPersonController>();
        this.lastPositionY = this.transform.position.y;
        this.onStaminaChange.trigger(this.stamina / this.maxStamina);
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update(): void {
        const currentPositionY = this.transform.position.y;
        const verticalVelocity = (currentPositionY - this.lastPositionY) / Time.deltaTime;
        this.lastPositionY = currentPositionY;

        // Check if the player is moving upwards (climbing stairs)
        if (verticalVelocity > 0.1 && this.characterController.Grounded) {
            this.adjustStamina(-this.staminaDrainRate * Time.deltaTime);
        }
        // Check if the player is moving downwards (going downstairs)
        else if (this.inRestArea) {
            this.adjustStamina(this.staminaRegenRate * Time.deltaTime);
        }

        this.currentSpeed = Mathf.Lerp(this.tiredSpeed, this.normalSpeed, this.stamina / this.maxStamina);
    }

    private adjustStamina(amount: number): void {
        try {
            this.stamina += amount;

            // Ensure stamina does not go above max or below min
            if (this.stamina >= this.maxStamina) {
                this.stamina = this.maxStamina;
            }
            if (this.stamina <= this.minStamina) {
                this.stamina = this.minStamina;
                this.characterController.enabled = false;
                this.onStaminaEnd.trigger();

            }
            const staminaPercentage = (this.stamina / this.maxStamina) * 100;

            let currentSFX = "";

            if (staminaPercentage <= 40 && staminaPercentage > 0 && amount < 0) {
                currentSFX = "BreathingSlow";
            }
            else if (staminaPercentage != 100 && amount > 0) {
                currentSFX = "Drinking";
            }

            if (currentSFX !== "" && currentSFX !== this.lastPlayedSFX) {
                AudioManager.Instance.playSFX(currentSFX);
                this.lastPlayedSFX = currentSFX; // Store the last played sound
            }
            else if (currentSFX === this.lastPlayedSFX && !AudioManager.Instance.isSFXPlaying(currentSFX)) {
                AudioManager.Instance.playSFX(currentSFX);
            }

            this.invokeStaminaEvent();

        } catch (error) {
            console.error("Error in adjustStamina:", error);
        }
    }

    private invokeStaminaEvent(): void {
        this.onStaminaChange.trigger(this.stamina / this.maxStamina);
    }

    public resetStamina(): void {
        this.stamina = this.maxStamina;
        this.onStaminaChange.trigger(this.stamina / this.maxStamina);
        this.characterController.enabled = true;
        this.isInDeathArea = false;
    }

    public getStamina(): number {
        return this.stamina;
    }

    public getSpeed(): number {
        return this.currentSpeed;
    }

    private OnTriggerEnter(other: Collider): void {
        if (other.gameObject.name.includes("RestArea")) {
            this.inRestArea = true;
        }
        if (other.gameObject.name.includes("DeathArea")) {
            this.isInDeathArea = true;
            this.stamina = this.minStamina;
            this.invokeStaminaEvent();
        }
        if (other.gameObject.name.includes("WinArea")) {
            this.isInDeathArea = false;
            this.winGame();

        }
    }

    private OnTriggerStay(other: Collider): void {
        if (other.gameObject.name.includes("RestArea")) {
            this.inRestArea = true;
        }
    }

    private OnTriggerExit(other: Collider): void {
        if (other.gameObject.name.includes("RestArea")) {
            this.inRestArea = false;
        }
    }

    private winGame(): void {
        TimerManager.Instance.stopTimer();
        ScoreManager.Instance.setScore();

        setTimeout(() => {
            GameManager.Instance.ChangeGameState(GameState.WIN_GAME);
        }, 3000);
    }
}
