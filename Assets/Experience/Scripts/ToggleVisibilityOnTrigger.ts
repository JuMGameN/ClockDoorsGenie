import { Collider, GameObject, MonoBehaviour, Transform } from 'UnityEngine';

export class ToggleVisibilityOnTrigger extends MonoBehaviour {

    private Start() {
        this.setChildrenActive(false);
    }
    OnTriggerEnter(other: Collider) {
        if (other.gameObject.tag === "Player") {
            this.setChildrenActive(true);
        }
    }

    OnTriggerExit(other: Collider) {
        if (other.gameObject.tag === "Player") {
            this.setChildrenActive(false);
        }
    }

    private setChildrenActive(active: boolean) {
        let parentTransform: Transform = this.gameObject.transform;
        let childCount: number = parentTransform.childCount;

        for (let i = 0; i < childCount; i++) {
            let child: GameObject = parentTransform.GetChild(i).gameObject;
            child.SetActive(active);
        }
    }
}
