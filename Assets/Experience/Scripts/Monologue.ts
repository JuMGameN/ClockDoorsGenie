
import { TMP_Text } from "TMPro";
import { MonoBehaviour, Collider } from "UnityEngine";
import PlayerStaminaManager from "./PlayerStaminaManager";
import GameManager from "./GameManager";
import TimerManager from "./TimerManager";
import ScoreManager from "./ScoreManager";
export default class Monologue extends MonoBehaviour {


    @SerializeField private monologueText: TMP_Text;
    private isTyping: boolean = false;

    private isPlayed: boolean[] = [false, false, false, false, false, false, false];
    private messages: string[][] = [
        ["Where… am I?", "I have to get out of here. But how?", "The clocks… do they mean something?", "Doors...?", ""], // Starting thoughts
        ["I hope this is the right one…", "Please let this be the way out.", "The time… I need to focus.", "If I mess this up, I’ll just go higher…", "This has to be it. It has to be.", ""], // Choosing a door
        ["No… I’m going the wrong way!", "I can’t keep climbing forever…", "My legs are getting heavy…", "I need to find water, fast.", "I can’t afford too many mistakes.", ""], // Wrong door (going up)
        ["Down. That’s good.", "This has to be the way out… right?", "The ground has to be somewhere below.", "Keep going. Don’t stop.", ""], // Correct door (going down)
        ["Water! Finally!", "I needed that.", "I don’t know how much longer I can last without this.", "I have to be careful with my bottle…", "This should keep me going a little longer.", ""], // Finding water
        ["No… I can’t go on…", "My throat… dry… I…", "I shouldn’t have gone the wrong way so many times…", "I… can’t… move…", ""], // Running out of water (Game Over)
        ["The ground… it’s real!", "I made it! I actually made it!", "I can breathe. I’m free.", "Wait, ... this is not my bedroom.", "Where am I?", "To be continued...", ""] // Reaching the ground
    ];

    @SerializeField private messageIndex: number;
    private textDisplayTime: number = 3000;

    private Start() {
        this.monologueText.text = "";
        GameManager.Instance.OnGamePlay.addListener(() => this.showMessages(0));
        GameManager.Instance.OnWinGame.addListener(() => this.showMessages(6));
        let player = this.gameObject.GetComponent<PlayerStaminaManager>();
        player.onStaminaChange.addListener((stamina: number) => this.staminaMessage(stamina));

    }

    staminaMessage(stamina: number): void {
        if (stamina < 0.9) {
            this.showMessages(2);
        }
        else if (stamina < 0.3) {
            this.showMessages(5);
        }
    }

    showMessages(categoryIndex: number): void {
        if (this.isTyping) {
            this.stopMessages();
        }
        else {
            if (categoryIndex < this.messages.length && !this.isPlayed[categoryIndex]) {
                this.isTyping = true;
                this.monologueText.gameObject.SetActive(true);
                this.isPlayed[categoryIndex] = true;
                this.messages[categoryIndex].forEach((message, i) => {
                    setTimeout(() => {
                        this.monologueText.text = message;
                        this.isTyping = false;
                    }, i * 3000);

                });
            }
        }

    }

    stopMessages(): void {
        this.monologueText.text = "";
        this.monologueText.gameObject.SetActive(false);
    }
}
