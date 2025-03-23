import { Coroutine, GameObject, MonoBehaviour, Sprite, WaitForSeconds } from "UnityEngine";
import { Button, Image, Slider } from "UnityEngine.UI";
import GameManager, { GameState } from "./GameManager";
import AudioManager from "./AudioManager";
import PlayerStaminaManager from "./PlayerStaminaManager";
import TimerManager from "./TimerManager";
import { TMP_Text } from "TMPro";
import ScoreManager from "./ScoreManager";

export default class CanvasController extends MonoBehaviour {

    @Header("Main Menu UI References")
    @SerializeField private loadingPanel: GameObject;
    @SerializeField private playButton: Button;
    @SerializeField private loadingText: TMP_Text;

    @Header("Game Over UI References")
    @SerializeField private gameOverPanel: GameObject;
    @SerializeField private replayButton: Button;
    @SerializeField private gameOverText: TMP_Text;

    @Header("Win UI References")
    @SerializeField private winGamePanel: GameObject;
    @SerializeField private winText: TMP_Text;
    @SerializeField private winReplayButton: Button;

    @Header("Leaderboard UI References")
    @SerializeField private leaderboardGamePanel: GameObject;
    // @SerializeField private leaderboardButton: Button;

    private gameManager: GameManager;

    private staminaManager: PlayerStaminaManager;
    @Header("HUD UI References")
    @SerializeField private timerText: TMP_Text;

    water: Image;
    @SerializeField private muteButton: Button;
    @SerializeField private muteButtonImage: Image;
    @SerializeField private muteIcon: Sprite;
    @SerializeField private unmuteIcon: Sprite;

    Start() {
        //Get GameManager singleton and add a listener to OnGameStateChange event
        this.gameManager = GameManager.Instance;
        this.gameManager.OnGameStateChange.addListener(this.CheckGameState);

        //Add listeners to the Button click events
        this.muteButton.onClick.AddListener(this.OnMuteButtonPressed);
        this.replayButton.onClick.AddListener(this.OnReplayButtonPressed);
        // this.leaderboardButton.onClick.AddListener(this.OnLeaderboardButtonPressed);
        //   this.winReplayButton.onClick.AddListener(this.OnReplayButtonPressed);

        TimerManager.Instance.onTimeUpdate.addListener(this.updateTimerUI);

        //Disable the play button until the avatar is loaded
        this.playButton.interactable = false;
        this.muteButtonImage.sprite = this.unmuteIcon;

        this.staminaManager = GameObject.Find("GenieThirdPersonRig").GetComponent<PlayerStaminaManager>();
        if (this.staminaManager != null) {
            this.staminaManager.onStaminaChange.addListener(this.updateStaminaBar);
            //  this.staminaManager.onStaminaEnd.addListener(this.OnGameOver);
        } else {
            console.error("StaminaManager not found!");
        }
        GameManager.Instance.ChangeGameState(GameState.INITIAL);
        //this.CheckGameState(GameState.INITIAL);
    }
    OnLeaderboardButtonPressed() {
        const isPressed = this.leaderboardGamePanel.activeSelf;
        this.leaderboardGamePanel.SetActive(!isPressed);
    }
    private updateStaminaBar(staminaPercentage: number): void {

        this.water.fillAmount = staminaPercentage;
    }

    private updateTimerUI(timeString: string): void {
        if (this.timerText) {
            this.timerText.text = timeString;
        }
    }

    /** Manages the enemy logic when the game state changes. @param newState */
    private CheckGameState(newState: GameState) {
        switch (newState) {
            case GameState.INITIAL:
                this.OnStart();
                break;
            case GameState.LOADING:
                this.OnLoading();
                break;
            case GameState.GAME_PLAY:
                this.OnGamePlay();
                break;
            case GameState.GAME_OVER:
                this.OnGameOver();
                break;
            case GameState.WIN_GAME:
                this.OnWinGame();
                break;
        }
    }

    private OnWinGame() {
        setTimeout(() => {
            this.gameOverPanel.SetActive(false);
            this.loadingPanel.SetActive(false);
            this.winGamePanel.SetActive(true);
            this.winText.text = "Your time \n" + TimerManager.Instance.getElapsedTimeFormatted(ScoreManager.Instance.getScore())
                + "\nOverall best time \n" + TimerManager.Instance.getElapsedTimeFormatted(ScoreManager.Instance.getGlobalHighScore());
            this.replayButton.GetComponentInChildren<TMP_Text>().text = "Restart";
            this.replayButton.gameObject.SetActive(true);
            this.loadingText.gameObject.SetActive(false);
            //      this.leaderboardButton.gameObject.SetActive(true);
        }, 1000);
    }
    /** This will manage the canvas once the Avatar is loading. */
    private OnStart() {
        this.gameOverPanel.SetActive(false);
        this.loadingPanel.SetActive(true);
        this.winGamePanel.SetActive(false);
        this.replayButton.GetComponentInChildren<TMP_Text>().text = "Play";
        this.replayButton.gameObject.SetActive(true);
        this.loadingText.gameObject.SetActive(false);
        //    this.leaderboardButton.gameObject.SetActive(false);
        this.leaderboardGamePanel.SetActive(false);
    }

    private OnLoading() {
        this.gameOverPanel.SetActive(false);
        this.loadingPanel.SetActive(true);
        this.winGamePanel.SetActive(false);
        this.replayButton.gameObject.SetActive(false);
        this.loadingText.gameObject.SetActive(true);
        //   this.leaderboardButton.gameObject.SetActive(false);
        this.leaderboardGamePanel.SetActive(false);
    }

    private OnGamePlay() {
        this.gameOverPanel.SetActive(false);
        this.loadingPanel.SetActive(false);
        this.winGamePanel.SetActive(false);
        this.replayButton.gameObject.SetActive(false);
        this.loadingText.gameObject.SetActive(false);
        //    this.leaderboardButton.gameObject.SetActive(false);
        this.leaderboardGamePanel.SetActive(false);
    }

    /** This will manage the canvas once the game ends. */
    private OnGameOver() {
        this.gameOverPanel.SetActive(true);
        this.loadingPanel.SetActive(false);
        this.winGamePanel.SetActive(false);
        this.gameOverText.text = "Your best time \n" + TimerManager.Instance.getElapsedTimeFormatted(Number(ScoreManager.Instance.getPersonalHighScore()))
            + "\nOverall best time \n" + TimerManager.Instance.getElapsedTimeFormatted(ScoreManager.Instance.getGlobalHighScore());
        this.replayButton.GetComponentInChildren<TMP_Text>().text = "Restart";
        this.replayButton.gameObject.SetActive(true);
        this.loadingText.gameObject.SetActive(false);
        //    this.leaderboardButton.gameObject.SetActive(true);
        this.leaderboardGamePanel.SetActive(false);
    }

    private OnMuteButtonPressed() {
        AudioManager.Instance.muteAll();
        this.muteButtonImage.sprite = AudioManager.Instance.isAllMuted() ? this.muteIcon : this.unmuteIcon;
    }
    /** Set the game state back to replay the game. */
    private OnReplayButtonPressed() {
        GameManager.Instance.ChangeGameState(GameState.LOADING);
        setTimeout(() => {
            GameManager.Instance.ChangeGameState(GameState.GAME_PLAY);
        }, 3000);
    }

}