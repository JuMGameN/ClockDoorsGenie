
import { MonoBehaviour, Collider } from "UnityEngine";
import GameManager, { GameState } from "./GameManager";
import TimerManager from "./TimerManager";
import ScoreManager from "./ScoreManager";
export default class WinGame extends MonoBehaviour {

    private OnTriggerEnter(other: Collider) {
        if (other.gameObject.tag === "Player") {
            TimerManager.Instance.stopTimer();
            ScoreManager.Instance.setScore();

            setTimeout(() => {
                GameManager.Instance.ChangeGameState(GameState.WIN_GAME);
            }, 3000);

        }
    }
}
