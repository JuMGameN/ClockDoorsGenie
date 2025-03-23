
import { GeniesThirdPersonController, StarterAssetsInputs } from "StarterAssets";
import { Mathf, Physics, Time, MonoBehaviour, Vector3, Collider, RaycastHit, Ray } from "UnityEngine";

export default class Downstairs extends MonoBehaviour {

    private jumpHeight: number = 2;
    private normalGravity: number = 9.81
    private velocity: Vector3 = new Vector3(0, 0, 0);
    private isOnStairs: boolean = false;
    private starterAssetsInputs: StarterAssetsInputs;
    private thirdpersonController: GeniesThirdPersonController;
    private checkRadius: number = 1.0;
    private rayDistance: number = 1.5;
    stairGravity: number = 30;
    playerGravity: number = 9.81;

    private Start() {
        this.starterAssetsInputs = this.transform.GetComponent<StarterAssetsInputs>();
        this.thirdpersonController = this.transform.GetComponent<GeniesThirdPersonController>();
        this.playerGravity = this.thirdpersonController.Gravity;
    }

    public Update(): void {

        this.checkStairs();
        if (this.isOnStairs) {

            this.playerGravity -= this.stairGravity * Time.deltaTime;

        } else if (this.isJumping()) {
            this.playerGravity = Mathf.Sqrt(this.jumpHeight * 2 * this.normalGravity);
        }
        else {
            // Apply gravity
            this.playerGravity -= this.normalGravity * Time.deltaTime;

        }

    }

    private isJumping(): boolean {
        if (this.starterAssetsInputs.jump) {
            return true;
        }
        return false;
    }

    private checkStairs(): void {
        let ref = $ref<RaycastHit>(); // Declare RaycastHit as a reference type
        let rayStart = this.transform.position;
        let rayDirection = Vector3.down; // Cast ray downward

        // Create a Ray with origin and direction
        let ray = new Ray(rayStart, rayDirection);

        // The third argument is for max distance. It will now use the hit reference directly
        if (Physics.Raycast(ray, ref, this.rayDistance)) {
            let hitInfo = $unref(ref);
            if (hitInfo.collider.gameObject.name.includes("Stairs")) {
                this.isOnStairs = true;
                return;
            }
        }

        this.isOnStairs = false;
    }

}
