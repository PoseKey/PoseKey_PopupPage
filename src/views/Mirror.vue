<template>
    <div>
        <div id="ifNErr">
            <canvas id="output" width="640" height="480"></canvas>
        </div>
        <div id="ifErr" style="display:none">
            <p id=info> Camera access has been denied. If you have camera, you can allow access
            <a href="chrome-extension://pifojknhlbglpfoehbppiddjlgebooom/options.html" target="_blank">here</a>
            .</p>
        </div>
        <div>All Icons made by <a href="https://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" 			    title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" 			    title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
    </div>
</template>

<script>
import * as posenet from '@tensorflow-models/posenet';
import * as utils from "../util";
let net;
let video;
let width = 640, height = 480;
let stream;
export default {
    name: 'Mirror',
    data () {
        return {
            msg: 'Welcome to Your Vue.js App',
            loading: true
        }
    },
    methods: {
        
    },
    async mounted(){
        net = await posenet.load(1.01);
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
        detectPose(video,net);
    },
    beforeDestroy(){
        net.dispose();
        console.log('disposed');
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

function detectPose(video,net){
    const canvas = document.getElementById('output');
    const ctx = canvas.getContext('2d');
    async function detect(){
        const pose = await net.estimateSinglePose(video,0.3,true,16);
        ctx.clearRect(0,0,width,height);
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-width, 0);
        ctx.drawImage(video,0,0,width,height);
        ctx.restore();
        if (pose.score >= 0.1) {
            utils.drawKeypoints(pose.keypoints, 0.3, ctx);
            utils.drawSkeleton(pose.keypoints, 0.3, ctx);
            // utils.drawBoundingBox(pose.keypoints, ctx);
        }
        requestAnimationFrame(detect);
    }
    detect();
}
// setup();
</script>

<style scoped>

</style>