import { EnermyAI } from "../../logic/enermyAI.js";
import { WorldManager } from "../../world/WorldManager.js";
import { Entity } from "../entity.js";

export class Enermy extends Entity {

   /**
     * An entity is a Phaser sprite with some actions.
     * 
     * @param {Phaser.Scene} scene - Scene
     * @param {Number} x - x position
     * @param {Number} y - y position
     * @param {String} texture - texture
     * @param {Object} infos - infomations of this entity
     * @param {String} infos.name - name of Entity
     * @param {String} infos.type - type of entity
     * @param {Array} infos.states - for collider check with block
     * @param {Number} infos.heart - health for entity
     * @param {Number} infos.speed - pixels per second
     * @param {Item} [infos.hold] - Which item they held
     * @param {WorldManager} worldManager
     */
    constructor(scene, x, y, texture, infos, worldManager) {
        infos.type = "enermy";
        super(scene, x, y, texture, infos, worldManager);
        
    }
    /**@param {WorldManager} worldManager */
    addAI(worldManager) {
        this.AI = new EnermyAI(this.scene, worldManager, this);
    }
}