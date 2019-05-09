<template>
    <v-card height="360">
        <canvas id="output" width="610" height="360"></canvas>
        <v-card-text id="ifErr" style="display:none">
            <p id=info> Camera access has been denied. If you have camera, you can allow access
            <a href="chrome-extension://pifojknhlbglpfoehbppiddjlgebooom/options.html" target="_blank">here</a>
            .</p>
        </v-card-text>
    </v-card>
</template>

<script>
import * as posenet from '@tensorflow-models/posenet';
import * as utils from "../util";
import store from '../store'

let net;
let video;
let width = 640, height = 480;
let stream;
export default {
    name: 'Mirror',
    data () {
        return {
            msg: 'Welcome to Your Vue.js App',
            loading: true,
            pm:1.0,
            sc:0.4,
        }
    },
    methods: {
        
    },
    async mounted(){
        try{
            video = await loadVideo();
        }
        catch(e){
            let ifErr = document.getElementById('ifErr');
            ifErr.style.display = 'block';

            let ifNErr = document.getElementById('ifNErr');
            ifNErr.style.display = 'none';
            throw e;
        }
        let db = this.$db.requireDB();
        let uid = store.state.user.uid;
        db.collection('users').doc(uid).collection('model').doc('setting').get().then(
            async (data)=>{
                if(data.exists){
                    switch(data.data().pm){
                        case 0:
                            this.pm = 0.5;
                            break;
                        case 1:
                            this.pm = 0.75;
                            break;
                        case 2:
                            this.pm = 1.0;
                            break;
                        default:
                            this.pm = 1.01;
                    }
                    this.sc = data.data().sc;
                    // console.log(this.sc, this.pm);
                }
                net = await posenet.load(this.pm);
                detectPose(video,net, this.sc);
            }
        );
    },
    beforeDestroy(){
        net.dispose();
        video.pause();
        video.srcObject = null;
        stream.getTracks().forEach((track) => {
            track.stop();
        });
    }
}
async function loadVideo(){
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available');
    }
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    let video = document.createElement('video');
    video.height = height;
    video.width = width;
    video.srcObject = stream;
    video.play();
    return video;
}

function detectPose(video,net, imageScale){
    const canvas = document.getElementById('output');
    const ctx = canvas.getContext('2d');
    async function detect(){
        const pose = await net.estimateSinglePose(video,imageScale,true,16);
        ctx.clearRect(0,0,width,height);
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-width, 0);
        ctx.drawImage(video,0,0,width,height);
        ctx.restore();
        if (pose.score >= 0.1) {
            utils.drawKeypoints(pose.keypoints, 0.5, ctx);
            utils.drawSkeleton(pose.keypoints, 0.5, ctx);
        }
        requestAnimationFrame(detect);
    }
    detect();
}
</script>

<style scoped>

</style>