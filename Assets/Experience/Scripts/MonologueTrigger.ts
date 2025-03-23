
import { MonoBehaviour, Collider } from "UnityEngine";
import Monologue from "./Monologue";
export default class MonologueTrigger extends MonoBehaviour {
    @SerializeField private monologueIndex: number;

    private OnTriggerEnter(other: Collider) {
        let player = other.GetComponent<Monologue>();
        if (player) {
            player.showMessages(this.monologueIndex);
        }
    }
}