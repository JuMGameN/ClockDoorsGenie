
import { MonoBehaviour, GameObject } from "UnityEngine";
import GameManager from "./GameManager";
import ScoreManager from "./ScoreManager";
import AudioManager from "./AudioManager";
export default class WinGame extends MonoBehaviour {

    @SerializeField private tower: GameObject;
    @SerializeField private earth: GameObject;
    private isWon = false;
    private Start() {
        GameManager.Instance.OnWinGame.addListener(() => this.hideBuildingAndSetScore());
        GameManager.Instance.OnLoading.addListener(() => this.showBuildingAndSetScore());
    }

    private hideBuildingAndSetScore() {
        this.tower.gameObject.SetActive(false);
        ScoreManager.Instance.setScore();
        AudioManager.Instance.playMusic("Win");
        this.isWon = true;
    }

    private showBuildingAndSetScore() {
        if (this.isWon) {
            this.tower.gameObject.SetActive(true);
            this.earth.gameObject.SetActive(false);
            AudioManager.Instance.playMusic("Theme");
        }
    }

}
