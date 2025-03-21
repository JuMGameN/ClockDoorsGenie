
import { MonoBehaviour, Random } from "UnityEngine";
import { TMP_Text } from "TMPro";
export default class UniqueRandomTime extends MonoBehaviour {

    private static assignedTimes: Set<string> = new Set(); // Stores used times
    private textComponent: TMP_Text | null = null;

    private Start(): void {
        this.textComponent = this.GetComponent<TMP_Text>();

        if (this.textComponent) {
            let uniqueTime = this.generateUniqueTime();
            this.textComponent.text = uniqueTime;
        }
    }

    private generateUniqueTime(): string {
        let time: string;
        do {
            let hours = Random.Range(0, 24);
            let minutes = Random.Range(0, 60);
            let seconds = Random.Range(0, 60);

            time = this.formatTime(hours, minutes, seconds);
        } while (UniqueRandomTime.assignedTimes.has(time)); // Ensure uniqueness

        UniqueRandomTime.assignedTimes.add(time);
        return time;
    }

    private formatTime(hours: number, minutes: number, seconds: number): string {
        let h = hours.toString().padStart(2, "0");
        let m = minutes.toString().padStart(2, "0");
        let s = seconds.toString().padStart(2, "0");
        return `${h}:${m}:${s}`;
    } private Update(): void { }
}
