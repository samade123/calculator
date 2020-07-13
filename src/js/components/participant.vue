<template>
    <div class="vid-wrapper" :class="id">
        <audio v-if="participant" :id="participant.sid" class="" autoplay playsinline width="500px" ref="local"></audio>
        <div class="particpant-label">{{ participant.identity }}</div>
        <div v-if="noVid" class="no-video"><vs-avatar color="#875612" size="40px" :text="participant.identity[0]" /></div>
        <div class="no-audio"><vs-icon :icon="noAudio ? 'volume_off' : 'volume_up'"></vs-icon></div>
    </div>
</template>

<script>
const { connect, createLocalTracks, createLocalVideoTrack, createLocalAudioTrack } = require("twilio-video");

export default {
    props: {
        room: {
            type: Object,
        },
        id: {
            type: String,
        },
    },
    data() {
        return {
            participant: {},
            videoTracks: [],
            particapntEventsSet: false,
            noVid: false,
            noAudio: false,
        };
    },
    watch: {
        "room.participants": {
            deep: true,
            immediate: true,
            handler: "getParticipant",
        },
    },
    methods: {
        clearTracks() {
            console.log("clearing!!!");
            // if (this.videoTracks.length > 0) {
            //     this.videoTracks.forEach((track) => {
            //         console.debug("trck: ", track);
            //         track.detach();
            //     });
            // }
            this.videoTracks.forEach((track) => {
                this.videoElements = document.querySelectorAll(`video#${track.sid}-${this.id}`);
                if (this.videoElements.length > 0) {
                    this.videoElements.forEach((element) => {
                        element.remove();
                    });
                }
            });
        },
        clearVideoElements() {
            this.videoTracks.forEach((track) => {
                this.videoElements = document.querySelectorAll(`video#${track.sid}-${this.id}`);
                if (this.videoElements.length > 0) {
                    this.videoElements.forEach((element) => {
                        element.remove();
                    });
                }
            });
        },
        setVideoTrackEvents(track) {
            track.on("disabled", () => { // using these events you can manipulate the medi elemnts if muted or not
                var videoTrack = document.querySelector(`video#${track.sid}-${this.id}`);
                console.log(videoTrack, "found!!!!!!!");
                this.noVid = true;
                // videoTrack.style.opacity = "0";
            });

            track.on("enabled", () => {
                var videoTrack = document.querySelector(`video#${track.sid}-${this.id}`);
                this.noVid = false;
                // videoTrack.style.display = "1";
            });
        },
        setAudioTrackEvents(track) {
            track.on("disabled", () => { // using these events you can manipulate the medi elemnts if muted or not
                var audioTrack = document.querySelector(`video#${track.sid}-${this.id}`);
                console.log(audioTrack, "found!!!!!!!");
                this.noAudio = true;
                // audioTrack.style.opacity = "0";
            });

            track.on("enabled", () => {
                var audioTrack = document.querySelector(`video#${track.sid}-${this.id}`);
                this.noAudio = false;
                // audioTrack.style.display = "1";
            });
        },
        addTrack(track) { //on the track being added separate the method of adding track based on kind
                            // doing it like this as twilio way off adding audio tracks means no sound comes out
            if (track.kind == "video") {
                this.setVideoTrackEvents(track); // handle track events
                console.debug("Found a video track", track);
                this.videoTracks.push(track); // push video tracks into an array and deal with it
                this.setVideoElements();
            }
            if (track.kind == "audio") {
                this.setAudioTrackEvents(track);
                this.remoteStream.addTrack(track.mediaStreamTrack);
            }
            this.remoteAudio.srcObject = this.remoteStream;
        },
        setVideoElements() { // this would be better handled in a component of it's own
            this.clearVideoElements(); // removes all video elements for this particpant only
            if (this.videoTracks.length == 1) {
                var vid = document.createElement("video");
                vid.id = `${this.videoTracks[0].sid}-${this.id}`;
                vid.width = this.windowWidth > 600 ?  "500" : "350";
                // document.getElementsByClassName("vid-wrapper")[0].appendChild(this.videoTracks[0].attach());
                document.getElementsByClassName(this.id)[0].appendChild(vid); //append empty video eelment inside vid-wrapper div(specific to this particpant)
                setTimeout(() => {
                    this.videoTracks[0].attach(document.getElementById(`${this.videoTracks[0].sid}-${this.id}`)); //attach video track to video elemnt just created
                }, 300);
            } else if (this.videoTracks.length > 1) { // most definitly could have compressed this code to use just a foreach
                                                        //as the two blocks of code are almost identical
                this.videoTracks.forEach((track) => {
                    var vid = document.createElement("video");
                    vid.id = `${track.sid}-${this.id}`;
                    vid.width = track.priority == "high" ? "500" : "200";
                    document.getElementsByClassName(this.id)[0].appendChild(vid);
                    setTimeout(() => {
                        track.attach(document.getElementById(`${track.sid}-${this.id}`));
                    }, 300);
                });
            }
        },
        displayMedia() {
            this.remoteStream = null;
            this.remoteStream = new MediaStream(); // initaiate new mediastreams and clears out any audio tracks initially in stream

            // this.remoteAudio = document.getElementById(this.id);
            this.remoteAudio = this.$refs.local;
            console.log(this.remoteAudio, this.participant);
            // this.clearTracks();

            this.participant.tracks.forEach((publication) => {
                if (publication.isSubscribed) {
                    const track = publication.track;
                    console.debug("publication track added: ", publication.track, track.priority);
                    this.addTrack(track);
                }
            });
            if (!this.particapntEventsSet) { //only set this event trigger once
                this.participant.on("trackSubscribed", (track, publication) => { //annoyingly the track priority is set on the publication
                                                                                    // publication is just another wrapper around the twilio track
                    console.debug("suscribed tracks!!!!", track, publication, publication.publishPriority);
                    track.setPriority(publication.publishPriority); /* you can use the twilio setPrority function to
                                                                     set the priority tto the track based on the publication 
                                                                     priortiy */
                    this.addTrack(track);
                    this.particapntEventsSet = true;
                });
            }

            if (this.participant) {
                this.remoteAudio.srcObject = this.remoteStream; // this sets the newly made mediaStream to the auido element
            }
        }, 
        getParticipant() {
            this.participant = this.room.participants.get(this.id);// "get(sid)"
            console.log("partciapant", this.participant, this.id); 
        },
    },
    created() {},
    mounted() {
        this.getParticipant();
        this.displayMedia();
        this.room.on("participantConnected", (participant) => {
            console.debug("This participant", this.participant.identity, " has registered a new participant ");
            this.getParticipant(); //sets what participant it is
        });

        this.room.on("trackPublished", (participant) => { // remote particpant publishes new track probably  a screen share log it here
            console.log("This participant", this.participant.identity, " has registered a new track published ");
            console.debug("adfasfs", this.participant.tracks);
        });
    },
};
</script>
