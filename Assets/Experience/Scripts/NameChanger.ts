
import { MonoBehaviour, Collider, GameObject } from "UnityEngine";
import GameManager from "./GameManager";
export default class NameChanger extends MonoBehaviour {

    earth: GameObject;

    private Start() {
        GameManager.Instance.OnLoading.addListener(() => this.changeNameBack());
    }

    private OnTriggerEnter(other: Collider) {
        if (other.gameObject.tag === "Player") {
            const myObject = GameObject.Find("DeathArea");
            if (myObject) {
                myObject.name = "WinArea";
            }
            this.earth.gameObject.SetActive(true);

        }
    }

    private changeNameBack() {
        const myObject = GameObject.Find("WinArea");
        if (myObject) {
            myObject.name = "DeathArea";
        }
        this.earth.gameObject.SetActive(false);
    }
}