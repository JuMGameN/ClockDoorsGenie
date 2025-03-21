
import { MonoBehaviour } from "UnityEngine";
import TimerManager from "./TimerManager";
export default class ScoreManager extends MonoBehaviour {
    score: number = 0;

    @NonSerialized public static Instance: ScoreManager;

    Awake() {
        //Establishes the GameManager singleton instance
        if (ScoreManager.Instance == null) {
            ScoreManager.Instance = this;
        } else {
            ScoreManager.Destroy(this.gameObject);
        }
    }

    setScore() {
        this.score = TimerManager.Instance.getElapsedTime();
    }

    getScore() {
        return this.score;
    }

}
