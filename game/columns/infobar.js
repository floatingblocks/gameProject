import { lang } from "../config/lang.js";
import { Player } from "../entity/player.js";

export class InfoBar extends Phaser.GameObjects.DOMElement  {

    static HTML = `
<style>
    @font-face {
        font-family: "Unifont";
        src: url(/UpstreamSource/unifont/unifont-14.0.01.ttf);
    }

    .self-infos {
        font-family: "Unifont";
        color: azure;
        height: 4.2em;
        width: 48em;

        padding: 0.3em;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 0.2em;

        display: flex;
    }
    .big-box-layer {
        border: 0.4em rgb(214, 214, 214) solid;
        border-radius: 0.2em;
        box-shadow: 0 0 0.2em rgba(24, 24, 24, 0.6), inset 0 0 0.2em rgba(24, 24, 24, 0.6);
        background-color: rgb(56, 56, 56);
        margin: 0.2em;
    }
    .statues-bars {
        margin: 0.1em;
        margin-left: 0.3em;
        display: flex;
        flex-direction: column;
    }

    .statues-bars > div {
        display: flex;
        margin-top: 0.2em;
    }

    .statues-bars > div:first-child {
        margin-top: auto;
    }

    .statues-bars > div > div {
        margin-left: 0.2em;
    }
    .statues-bars > div > div:first-child {
        margin-left: 0;
    }
    .statues-bars .bar {
        display: grid;
        grid-template-columns: 1.8em 7em 2.6em;
    }
    .statues-bars .title {
        background-color: rgb(214, 214, 214);
        box-shadow: 0 0 0.2em rgba(24, 24, 24, 0.6);
        border-radius: 0.1em;
        padding: 0 0.15em 0 0.15em;
        font-weight: bold;
        color: #3f3f3f;
    }

    .statues-bars .volume {
        background-color: #3f3f3f;
        border: 0.4em solid #888f91;
        border-radius: 0.1em;
        margin-right: 0.2em;
    }

    .statues-bars .volume-color {
        background-color: #f1a05d;
        height: 100%;
        width: 50%;
    }

    .statues-bars .state-info {
        color:rgb(214, 214, 214);
        font-weight: bold;
        text-shadow: #3f3f3f;
        background-color: #3f3f3f7a;
        border-radius: 0.1em;
        margin-left: auto;
        text-align: center;
        width: 100%;
    }

    .push {
        margin-left: auto;
    }

    /*big box layer's info and img*/
    .big-box-layer {
        width: 3.2em;
        height: 3.2em;
        position: relative;
    }
    .big-box-layer .info {
        position: absolute;
        text-shadow: #3f3f3f;
        z-index: 10; 
        font-weight: bold;
        top: 2em;
        left: 2em;
    }
    .big-box-layer img {
        width: 100%;
        height: 100%;
    }
</style>

<div class="self-infos">
    <div class="big-box-layer player-pic">
        <div class="info">32</div>
        <img src="" title=""></img>
    </div>
    <div class="statues-bars">
        <div class="infomations">
            <div class="title name">NAME</div>
            <div class="title state">STATE</div>
        </div>
        <div class="hp bar">
            <div class="title">HP:</div>
            <div class="volume">
                <div class="volume-color"></div>
            </div>
            <div class="state-info">0/20</div>
        </div>
        <div class="mp bar">
            <div class="title">MP:</div>
            <div class="volume">
                <div class="volume-color"></div>
            </div>
            <div class="state-info">10/20</div>
        </div>
    </div>
    <div class="push"></div>
    <div class="left-click-bar big-box-layer">
        <div class="info">999</div>
        <img src="" title=""></img>
    </div>
    <div class="right-click-bar big-box-layer">
        <div class="info">999</div>
        <img src="" title=""></img>
    </div>
</div>
`
    /**
     * 
     * @param {Phaser.Scene} scene 
     * @param {Player} player 
     */
    constructor(scene, player) {
        super(scene);

        /**@type {Player} */
        this.player = player;
        
        this.scene = scene;
        this.initElement();
        this.addToUpdateList() 
    }

    preUpdate(delta, time) {
        super.preUpdate(delta, time);

        let dip = this.displayed;
        const infos = this.player.infos;
        // update name
        if (dip.name !== infos.name) {
            dip.name = infos.name;
            this.nodes.name.textContent = dip.name;
        }
        // update state
        if (dip.state !== infos.states.join(",")) {
            dip.state = infos.states.join(",");
            this.nodes.state = dip.state;
        }
        // update hp
        if (dip.hp.now !== infos.hp.now || dip.hp.total !== infos.hp.total) {
            dip.hp.now = infos.hp.now;
            dip.hp.total = infos.hp.total;
            this.nodes.hp.stateInfo.textContent = dip.hp.now + "/" + dip.hp.total;
            this.nodes.hp.volumeColor.style.width = Math.floor(dip.hp.now * 100 / dip.hp.total) + "%";
        }
        // uptate mp
        if (dip.mp.now !== infos.mp.now || dip.mp.total !== infos.mp.total) {
            dip.mp.now = infos.mp.now;
            dip.mp.total = infos.mp.total;
            this.nodes.mp.stateInfo.textContent = dip.mp.now + "/" + dip.mp.total;
            this.nodes.mp.volumeColor.style.width = Math.floor(dip.mp.now * 100 / dip.mp.total) + "%";
        }

    }

    initElement() {
        const pxPerEm = parseFloat(getComputedStyle(document.body).fontSize);
        const height = 2.5 * pxPerEm;
        const x = this.scene.scale.width / 2;
        const y = this.scene.scale.height - height;
        /**@type {Phaser.GameObjects.DOMElement} */
        this.real = this.scene.add.dom(x, y).createFromHTML(InfoBar.HTML);

        const infos = this.player.infos;
        this.displayed = {
            name: infos.name,
            state: infos.states.join(','),
            hp: {
                now: infos.hp.now,
                total: infos.hp.total
            },
            mp: {
                now: infos.mp.now,
                total: infos.mp.total
            },
            bar: {
                leftClick: infos.hold.rightHand,
                rightChick: infos.hold.leftHand
            }
        }

        this.nodes = {
            playerAvatar: {
                pic: document.querySelector(".self-infos .player-pic img"),
                info: document.querySelector(".self-infos .player-pic .info"),
            },
            name: document.querySelector(".self-infos .name"),
            state: document.querySelector(".self-infos .state"),
            hp: {
                volumeColor: document.querySelector(".self-infos .hp .volume-color"),
                stateInfo: document.querySelector(".self-infos .hp .state-info")
            },
            mp: {
                volumeColor: document.querySelector(".self-infos .mp .volume-color"),
                stateInfo: document.querySelector(".self-infos .mp .state-info")
            },
            leftClickBar: document.querySelector(".self-infos .left-click-bar"),
            rightChickBar: document.querySelector(".self-infos .right-click-bar"),
        }

        lang.setLang("zh");
        // init contents begin::
        // init player avator
        this.nodes.playerAvatar.info.textContent = "";
        this.nodes.playerAvatar.pic.title = lang.get("Avatar");

        // init name
        this.nodes.name.textContent = this.displayed.name;
        // init state
        this.nodes.state.textContent = this.displayed.state;

        // init hp
        this.nodes.hp.stateInfo.textContent = this.displayed.hp.now + "/" + this.displayed.hp.total
        this.nodes.hp.volumeColor.style.width = Math.floor(this.displayed.hp.now * 100 / this.displayed.hp.total) + "%";
        // init mp 
        this.nodes.mp.stateInfo.textContent = this.displayed.mp.now + "/" + this.displayed.mp.total
        this.nodes.mp.volumeColor.style.width = Math.floor(this.displayed.mp.now * 100 / this.displayed.mp.total) + "%";

        // init left and right
        // 暂时别了
    }
}