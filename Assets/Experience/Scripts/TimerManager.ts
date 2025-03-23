import { Time, MonoBehaviour } from "UnityEngine";
import GameManager from "./GameManager";

export default class TimerManager extends MonoBehaviour {

    private elapsedTime: number = 0;
    private isRunning: boolean = false;

    public onTimeUpdate: GeniesEvent<[string]> = new GeniesEvent<[string]>();


    @NonSerialized public static Instance: TimerManager;
    Awake() {
        //Establishes the GameManager singleton instance
        if (TimerManager.Instance == null) {
            TimerManager.Instance = this;
        } else {
            TimerManager.Destroy(this.gameObject);
        }
    }

    private Start() {
        GameManager.Instance.OnLoading.addListener(() => this.stopAndReset());
        GameManager.Instance.OnStart.addListener(() => this.stopAndReset());
        GameManager.Instance.OnGamePlay.addListener(() => this.startTimer());
        GameManager.Instance.OnGameOver.addListener(() => this.stopTimer());
        GameManager.Instance.OnWinGame.addListener(() => this.stopTimer());
        this.Update();
    }
    private Update(): void {
        if (this.isRunning) {
            this.elapsedTime += Time.deltaTime;
        }
        this.updateUI();
    }

    private stopAndReset(): void {
        this.stopTimer();
        this.resetTimer();
    }

    // Start the timer
    public startTimer(): void {
        this.isRunning = true;
    }

    // Stop the timer
    public stopTimer(): void {
        this.isRunning = false;
    }

    // Reset the timer
    public resetTimer(): void {
        this.elapsedTime = 0;
        this.isRunning = false;
        this.updateUI();
    }

    // Get elapsed time in seconds
    public getElapsedTime(): number {
        return this.elapsedTime;
    }

    // Get formatted time (MM:SS)
    public getElapsedTimeFormatted(score: number): string {
        const minutes = Math.floor(score / 60);
        const seconds = Math.floor(score % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    private updateUI(): void {
        this.onTimeUpdate.trigger(this.getElapsedTimeFormatted(this.elapsedTime));
    }
}
