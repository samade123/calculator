<template>
    <div class="test-body">
        <div class="left half">
            <div class="top">
                <video id="localVideo" class="video" autoplay playsinline :width="windowWidth > 800 ? '50%' : '70%'" ref="localVideo"></video>
                <div class="controls">
                    <vs-button type="flat" :icon="tracksEnabled.video ? 'videocam' : 'videocam_off'" @click="switchCamera"></vs-button>
                    <vs-button type="flat" :icon="tracksEnabled.audio ? 'mic' : 'mic_off'" @click="switchAudio"></vs-button>
                </div>
            </div>

            <div class="bottom">
                <vs-list>
                    <vs-list-header title="Media Settings"></vs-list-header>
                    <vs-list-item title="Video Devices">
                        <vs-select v-if="devices.length > 0" class="selectExample" :width="windowWidth > 800 ? '300px' : '220px'" v-model="constraints.video">
                            <vs-select-item :key="index" :value="item.id" :text="item.label" v-for="(item, index) in devices.filter((device) => device.kind == 'video' || device.kind == 'videoinput')" />
                        </vs-select>
                    </vs-list-item>
                    <vs-list-item title="Audio Devices">
                        <vs-select v-if="devices.length > 0" class="selectExample" :width="windowWidth > 800 ? '300px' : '220px'" v-model="constraints.audio">
                            <vs-select-item :key="index" :value="item.id" :text="item.label" v-for="(item, index) in devices.filter((device) => device.kind == 'audio' || device.kind == 'audioinput')" />
                        </vs-select>
                    </vs-list-item>
                </vs-list>
                <vs-button type="flat" color="#F12E45" @click="enumerateDevices" icon="refresh">Refresh</vs-button>
            </div>
        </div>
        <div class="right half">
            <div class="room-name">Room: {{ room }}</div>
            <vs-button @click="joinRoom">Enter Room</vs-button>
        </div>
    </div>
</template>

<script>
const { connect, createLocalTracks, createLocalVideoTrack, createLocalAudioTrack } = require("twilio-video");

export default {
    props: {},
    data() {
        return {
            devices: [],
            constraints: {
                video: false,
                audio: false,
            },
            token: window.Token,
            room: "footbal",
            tracksEnabled: {
                video: true,
                audio: true,
            },
        };
    },
    watch: {},
    methods: {
        switchCamera() { // this function here switches all local video tracks on or off
            this.tracksEnabled.video = !this.tracksEnabled.video;
            console.debug(this.localTracks);
            if (this.tracksEnabled.video) {
                this.localTracks.forEach((localTrack) => {
                    localTrack.kind == "video" ? localTrack.enable() : false;
                });
            } else {
                this.localTracks.forEach((localTrack) => {
                    localTrack.kind == "video" ? localTrack.disable() : false;
                });
            }
        },
        switchAudio() { // this function here switches all local audio tracks on or off
            this.tracksEnabled.audio = !this.tracksEnabled.audio; 
             console.debug(this.localTracks);
            if (this.tracksEnabled.audio) {
                this.localTracks.forEach((localTrack) => {
                    localTrack.kind == "audio" ? localTrack.enable() : false;
                });
            } else {
                this.localTracks.forEach((localTrack) => {
                    localTrack.kind == "audio" ? localTrack.disable() : false;
                });
            }
        },
        getMedia() {
            createLocalTracks({
                video: this.constraints.video ? { deviceId: this.constraints.video } : true, // if no issues with permissions device picker will determine video or audio device
                audio: this.constraints.audio ? { deviceId: this.constraints.audio } : true, //if isseus with camera/mic permissions then it will wait fo r user to accept permissions and use the default audio and video devices
            }).then((localTracks) => {
                if (this.constraints.video == false || this.constraints.video.length == "0") {
                    this.enumerateDevices(true);
                }
                const localMediaContainer = document.getElementById("local-media");
                this.localVideo = this.$refs.localVideo;
                this.localStream = new MediaStream();
                this.localVideo.srcObject = this.localStream; //attaching an empty mediastream object to src object of the video element 
                this.localTracks = localTracks; // get the video ad audio tracks stored for sending for connection later

                localTracks.forEach((localTrack) => {
                    this.localStream.addTrack(localTrack.mediaStreamTrack); // add all tracks to mediastream attached to video element
                });                                                         // 
            });
        },
        joinRoom() {
            this.$emit("room", { room: this.room, tracks: this.localTracks }); // sending room name and tracks details
        },
        enumerateDevices(reset = false) {
            this.devices = [];
            navigator.mediaDevices
                .enumerateDevices()
                .then((deviceInfos) => {
                    deviceInfos.forEach((deviceInfo) => {
                        this.devices.push({
                            label: deviceInfo.label,
                            id: deviceInfo.id ? deviceInfo.id : deviceInfo.deviceId,
                            kind: deviceInfo.kind,
                        });
                    });
                    this.devices.length > 0 ? (this.constraints.video = this.devices.filter((device) => device.kind == "video" || device.kind == "videoinput")[0].id) : false;
                    this.devices.length > 0 ? (this.constraints.audio = this.devices.filter((device) => device.kind == "audio" || device.kind == "audioinput")[0].id) : false;
                    this.getMedia()
                })
                .catch((err) => console.error("Issue with devices", err));
        },
    },
    created() {},
    mounted() {
        this.enumerateDevices(); //on mounted attempt to get all mediadevice details - !! this won't work if user has'nt given camera/mic permissions yet
    },
};
</script>
