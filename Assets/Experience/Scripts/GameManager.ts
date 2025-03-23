import { GameObject, MonoBehaviour } from "UnityEngine";

/** This is an enumerator to describe a game state. */
export enum GameState {
    INITIAL,
    LOADING,
    GAME_PLAY,
    GAME_OVER,
    WIN_GAME
}

export default class GameManager extends MonoBehaviour {

    OnStart: GeniesEvent = new GeniesEvent();
    OnLoading: GeniesEvent = new GeniesEvent();
    OnGamePlay: GeniesEvent = new GeniesEvent();
    OnGameOver: GeniesEvent = new GeniesEvent();
    OnWinGame: GeniesEvent = new GeniesEvent();

    /** This is an event that is triggered when the current GameState changes. */
    @NonSerialized public OnGameStateChange: GeniesEvent<[GameState]> = new GeniesEvent<[GameState]>();
    /** This is an instance of the GameManager singleton. */
    @NonSerialized public static Instance: GameManager;
    /** The game's current GameState value. */
    private gameState: GameState;

    Awake() {
        //Establishes the GameManager singleton instance
        if (GameManager.Instance == null) {
            GameManager.Instance = this;
        } else {
            GameObject.Destroy(this.gameObject);
        }
    }

    Start() {
        this.ChangeGameState(GameState.INITIAL);
    }

    /** @returns the game's current GameState value */
    public GetGameState(): GameState {
        return this.gameState;
    }

    /**
     * This will set the current GameState value to a new value and trigger an event.
     * @param newState the new GameState value
     * @returns will return early if the new value equals the current value
     */
    public ChangeGameState(newState: GameState) {
        if (newState == this.gameState) {
            return;
        }

        this.OnGameStateChange.trigger(newState);
        this.gameState = newState;
        this.CheckGameState(newState);
    }

    CheckGameState(newState: GameState) {
        switch (newState) {
            case GameState.INITIAL:
                this.OnStart.trigger();
                break;
            case GameState.LOADING:
                this.OnLoading.trigger();
                break;
            case GameState.GAME_PLAY:
                this.OnGamePlay.trigger();
                break;
            case GameState.GAME_OVER:
                this.OnGameOver.trigger();
                break;
            case GameState.WIN_GAME:
                this.OnWinGame.trigger();
                break;
        }
    }
}
