<template>
    <div class="test-body">
        <div class="left half">
            <div class="top">
                <video id="localVideo" class="video" autoplay playsinline :width="windowWidth > 800 ? '50%' : '70%'" ref="localVideo"></video>
                <!-- <div id="local-media"></div> -->
                <div class="controls">
                    <vs-button type="flat" :icon="tracksEnabled.video ? 'videocam' : 'videocam_off'" @click="switchCamera"></vs-button>
                    <vs-button type="flat" :icon="tracksEnabled.audio ? 'mic' : 'mic_off'" @click="switchAudio"></vs-button>

                    <!-- <vs-button color="#F12E45" @click="getMedia">Test camera</vs-button> -->
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
    props: {
        messages: {
            type: Array,
        },
        showChat: {
            type: Boolean,
        },
        card: {
            type: Boolean,
        },
        localCamera: {
            type: Object,
        },
        currentRoom: {
            type: Object,
        },
        roomOpen: {
            type: Boolean,
        },
        showVideo: {
            type: Boolean,
        },
    },
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
        switchCamera() {
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
        switchAudio() {
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
                video: this.constraints.video ? { deviceId: this.constraints.video } : true,
                audio: this.constraints.audio ? { deviceId: this.constraints.audio } : true,
            }).then((localTracks) => {
                if (this.constraints.video == false || this.constraints.video.length == "0") {
                    this.enumerateDevices();
                }
                const localMediaContainer = document.getElementById("local-media");
                this.localVideo = this.$refs.localVideo;
                this.localStream = new MediaStream();
                this.localVideo.srcObject = this.localStream;
                this.localTracks = localTracks;

                localTracks.forEach((localTrack) => {
                    this.localStream.addTrack(localTrack.mediaStreamTrack);
                });
            });
        },
        joinRoom() {
            this.$emit("room", { room: this.room, tracks: this.localTracks });
        },
        enumerateDevices() {
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
                })
                .catch((err) => console.error("Issue with devices", err));
        },
    },
    created() {},
    mounted() {
        this.enumerateDevices();
        this.getMedia();
    },
};
</script>
