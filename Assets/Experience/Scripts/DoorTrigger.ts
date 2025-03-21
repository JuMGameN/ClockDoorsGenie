import { MonoBehaviour, Transform, Quaternion, Time, Mathf, Collider, WaitForSeconds } from 'UnityEngine';
import AudioManager from './AudioManager';


export default class DoorTrigger extends MonoBehaviour {

    public door: Transform;  // Assign the door GameObject in the Inspector
    public openAngle: number = 90; // Angle when door is open
    public closedAngle: number = 0; // Angle when door is closed
    public isOpen: boolean = false; // Track door state
    public rotationSpeed: number = 2; // Speed of opening/closing

    private currentAngle: number = 0; // Track current angle
    private closeCoroutine: any = null;
    private closeDelay: number = 3;

    OnTriggerEnter(other: Collider): void {
        if (other.tag === "Player") { // Ensure only the player can trigger it
            this.isOpen = true; // Toggle state

            AudioManager.Instance.playSFX("DoorOpen");
        }
    }

    OnTriggerExit(other: Collider): void {
        if (other.tag === "Player") { // Ensure only the player can trigger it
            // Start the coroutine to close the door after a delay
            this.closeCoroutine = this.StartCoroutine(this.closeDoorAfterDelay());
        }
    }

    private *closeDoorAfterDelay() {
        yield new WaitForSeconds(this.closeDelay); // Wait for 5 seconds
        this.isOpen = false; // Close the door
        AudioManager.Instance.playSFX("DoorClose");
    }

    Update(): void {
        if (!this.door) return;

        // Determine target angle
        const targetAngle = this.isOpen ? this.openAngle : this.closedAngle;

        // Smooth rotation
        this.currentAngle = Mathf.Lerp(this.currentAngle, targetAngle, this.rotationSpeed * Time.deltaTime);
        this.door.localRotation = Quaternion.Euler(0, this.currentAngle, 0);

    }
}
