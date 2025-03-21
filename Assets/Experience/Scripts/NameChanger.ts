
import { MonoBehaviour, Collider, GameObject } from "UnityEngine";
export default class NameChanger extends MonoBehaviour {

    earth: GameObject;
    private OnTriggerEnter(other: Collider) {
        if (other.gameObject.tag === "Player") {
            const myObject = GameObject.Find("DeathArea");
            if (myObject) {
                myObject.name = "WinArea";
            }
            this.earth.gameObject.SetActive(true);

        }
    }
}