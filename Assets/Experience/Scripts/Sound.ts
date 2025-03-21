
import { AudioClip } from "UnityEngine";
export default class Sound {

    nameSound: string;
    clipSound: AudioClip;

    constructor(nameSound: string, clipSound: AudioClip) {
        this.nameSound = nameSound;
        this.clipSound = clipSound;
    }

}
