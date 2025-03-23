import { MonoBehaviour, Camera, Material, Shader, Skybox } from "UnityEngine";
import GameManager from "./GameManager";

export default class SkyboxChanger extends MonoBehaviour {

    customSkybox: Material | null = null;
    customSkyboxWin: Material | null = null;
    private mainCamera: Camera | null = null; // Ensure mainCamera is initialized

    private Start(): void {
        // Find the main camera and check if it exists
        this.mainCamera = Camera.main;
        if (!this.mainCamera) {
            console.error("Main Camera not found!");
            return;
        }

        let skyboxComponent = this.mainCamera.gameObject.GetComponent<Skybox>();
        if (skyboxComponent && skyboxComponent.material) {
            this.customSkybox = skyboxComponent.material;
        }

        GameManager.Instance.OnStart.addListener(() => this.setCustomSkybox());
        GameManager.Instance.OnGamePlay.addListener(() => this.setCustomSkybox());
        GameManager.Instance.OnWinGame.addListener(() => this.setDefaultSkybox());
    }


    private setDefaultSkybox(): void {


        let skyboxComponent = this.mainCamera.GetComponent<Skybox>();
        if (!skyboxComponent) {
            skyboxComponent = this.mainCamera.gameObject.AddComponent<Skybox>();
        }
        skyboxComponent.material = this.customSkyboxWin;
    }

    private setCustomSkybox(): void {

        let skyboxComponent = this.mainCamera.GetComponent<Skybox>();
        if (!skyboxComponent) {
            skyboxComponent = this.mainCamera.gameObject.AddComponent<Skybox>();
        }
        skyboxComponent.material = this.customSkybox;

    }
}
