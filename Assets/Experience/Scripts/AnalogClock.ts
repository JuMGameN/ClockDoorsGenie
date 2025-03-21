import { TMP_Text } from 'TMPro';
import { MonoBehaviour, Transform, Quaternion } from 'UnityEngine';

export default class AnalogClock extends MonoBehaviour {

    public timeText: TMP_Text;
    public hourHand: Transform;
    public minuteHand: Transform;
    public secondHand: Transform;

    Update(): void {
        if (!this.timeText) return;

        // Try to parse the time from the UI text
        const parsedTime: Date = this.parseTime(this.timeText.text);
        if (!parsedTime) {
            return;
        }
        if (!parsedTime) return;

        const hours: number = parsedTime.getHours() % 12;
        const minutes: number = parsedTime.getMinutes();
        const seconds: number = parsedTime.getSeconds();

        // Convert time to rotation
        const hourAngle: number = (hours + minutes / 60) * 30; // 30° per hour
        const minuteAngle: number = (minutes + seconds / 60) * 6; // 6° per minute
        const secondAngle: number = seconds * 6; // 6° per second

        // Apply rotation
        this.hourHand.localRotation = Quaternion.Euler(0, 0, -hourAngle);
        this.minuteHand.localRotation = Quaternion.Euler(0, 0, -minuteAngle);
        this.secondHand.localRotation = Quaternion.Euler(0, 0, -secondAngle);
    }

    // Function to parse time string (handles various formats)
    private parseTime(timeString: string): Date | null {
        const date = new Date();
        const timeParts = timeString.split(':');
        if (timeParts.length < 2) return null;

        const hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1]);
        const seconds = timeParts.length > 2 ? parseInt(timeParts[2]) : 0;

        if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return null;

        date.setHours(hours, minutes, seconds);
        return date;
    }
}
