
import { MonoBehaviour } from "UnityEngine";
import TimerManager from "./TimerManager";
import GameManager from "./GameManager";
import { CloudSaveStorage } from "Genies.Experience.CloudSave";

export default class ScoreManager extends MonoBehaviour {
    score: number = 0;
    globalScore: number = 0;

    private personalStorage: CloudSaveStorage;
    private globalStorage: CloudSaveStorage;

    private personalStorageKey: string = "PersonalStorageKey";
    private globalStorageKey: string = "GlobalStorageKey";
    private floatHighScoreKey: string = "ClockDoorsHighScorePROD";


    @NonSerialized public static Instance: ScoreManager;

    Awake() {
        //Establishes the GameManager singleton instance
        if (ScoreManager.Instance == null) {
            ScoreManager.Instance = this;
        } else {
            ScoreManager.Destroy(this.gameObject);
        }
    }
    private async Start() {
        GameManager.Instance.OnWinGame.addListener(() => this.setScore());
        this.InitializeHighScores();

    }


    setScore() {
        this.score = TimerManager.Instance.getElapsedTime();
        this.CheckHighScore(this.personalStorage);
        this.CheckHighScore(this.globalStorage);
    }

    getScore() {
        return this.score;
    }
    private InitializeHighScores(): void {
        //Initialize Personal High Score
        this.personalStorage = new CloudSaveStorage(this.personalStorageKey, false);
        this.LoadHighScore(this.personalStorage);
        //Initialize Global High Score
        this.globalStorage = new CloudSaveStorage(this.globalStorageKey, true);
        this.LoadHighScore(this.globalStorage);
    }

    getPersonalHighScore() {
        this.CheckHighScore(this.personalStorage);
        this.LoadHighScore(this.personalStorage);

        return this.score;
    }
    getGlobalHighScore() {
        this.LoadHighScore(this.globalStorage);
        return this.globalScore;
    }


    private async LoadHighScore(storage: CloudSaveStorage) {
        await storage.Load();

        if (storage.Has(this.floatHighScoreKey)) {
            if (storage === this.globalStorage) {
                this.globalScore = storage.GetFloat(this.floatHighScoreKey);
            }
            else {
                this.score = storage.GetFloat(this.floatHighScoreKey);
            }


        } else {
            storage.SetFloat(this.floatHighScoreKey, 0);
            await storage.Save();
        }
    }

    private async CheckHighScore(storage: CloudSaveStorage) {
        await storage.Load();

        if (storage.Has(this.floatHighScoreKey)) {

            let highScore = storage.GetFloat(this.floatHighScoreKey);

            if (this.score < highScore || highScore == 0) {
                storage.SetFloat(this.floatHighScoreKey, this.score);
                await storage.Save();
            }
        }
    }

}
