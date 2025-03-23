
import { GeniesThirdPersonController, StarterAssetsInputs } from "StarterAssets";
import { CharacterController, MonoBehaviour, Time, Vector3 } from "UnityEngine";

export default class Falling extends MonoBehaviour {

    private thirdpersonController: GeniesThirdPersonController;
    private starterAssetsInputs: StarterAssetsInputs;
    private characterController: CharacterController;

    private Start(): void {
        this.thirdpersonController = this.transform.GetComponent<GeniesThirdPersonController>();
        this.starterAssetsInputs = this.transform.GetComponent<StarterAssetsInputs>();
        this.characterController = this.transform.GetComponent<CharacterController>();
    }


    private Update(): void {
        if (!this.thirdpersonController.Grounded && !this.starterAssetsInputs.jump) {
            this.restrictMovement();
        }
    }
    private restrictMovement(): void {
        if (this.characterController) {
            this.characterController.Move(new Vector3(0, this.characterController.velocity.y, 0) * Time.deltaTime);
        }
    }

}
