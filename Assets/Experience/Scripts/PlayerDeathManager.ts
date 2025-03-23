
import { Animator, CharacterController, GameObject, MonoBehaviour, Quaternion, Transform, Vector3 } from "UnityEngine";
import PlayerStaminaManager from "./PlayerStaminaManager";
import AudioManager from "./AudioManager";
import { CreateUserAvatar } from "Genies.Avatars.Sdk";
import GameManager, { GameState } from "./GameManager";
import TimerManager from "./TimerManager";
export default class PlayerDeathManager extends MonoBehaviour {

    respawnPoint: Transform;
    player: GameObject;
    deathSound: string;
    respawnTime = 3;
    animator: Animator;
    private staminaManager: PlayerStaminaManager;
    private characterController: CharacterController;
    private isDead = false;


    async Start() {
        this.characterController = this.GetComponent<CharacterController>();
        this.staminaManager = this.GetComponent<PlayerStaminaManager>();

        if (this.staminaManager != null) {
            this.staminaManager.onStaminaChange.addListener(this.checkDeath);
        }
        this.player = this.gameObject;
        await this.getAnimatorFromChildren();
        GameManager.Instance.OnLoading.addListener(() => this.respawn());
    }

    private async getAnimatorFromChildren(): Promise<void> {
        const avatar = this.GetComponent<CreateUserAvatar>();

        // Wait until `DidSpawn` is true
        while (!avatar.DidSpawn) {
            TimerManager.Instance.stopTimer();
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        TimerManager.Instance.startTimer();
        this.animator = this.GetComponentInChildren<Animator>();
    }


    private checkDeath(stamina: number): void {
        if (stamina <= 0 && !this.isDead) {
            TimerManager.Instance.stopTimer();
            this.die(this.staminaManager.isInDeathArea);
        }
    }

    private die(isInDeathArea: boolean): void {
        this.isDead = true;

        if (isInDeathArea) {
            this.animator.SetBool("IsDeadFalling", true);
        }
        else {
            this.animator.SetBool("IsDead", true);
        }
        AudioManager.Instance.playSFX(this.deathSound);

        setTimeout(() => {
            this.respawn();
            GameManager.Instance.ChangeGameState(GameState.GAME_OVER);
        }, 3000);
    }

    private respawn(): void {
        this.characterController.enabled = false;

        // Instantly move the player to the respawn point
        this.transform.position = this.respawnPoint.position;
        this.transform.rotation = Quaternion.identity;

        // Re-enable CharacterController after a short delay
        setTimeout(() => {
            this.characterController.enabled = true;
        }, 100);

        // Reset stamina
        if (this.staminaManager) {
            this.staminaManager.resetStamina();
        }
        this.animator.SetBool("IsDead", false);
        this.animator.SetBool("IsDeadFalling", false);


        this.isDead = false;
        TimerManager.Instance.resetTimer();
    }



}
