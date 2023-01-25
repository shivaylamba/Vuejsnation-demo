<template>
    <div class="w-3/4 m-auto">
      <div>
        <img src ="https://pbs.twimg.com/profile_images/1606297844838809600/wnhtwy6Z_400x400.png">
        <h1 class="text-2xl text-green-800">Object detection with Tensorflow</h1>
        <div v-if="!isStreaming">
          <button @click="openCamera">Open Camera</button>
        </div>
         <div v-else class="flex justify-between">
                <button
                  @click="stopStreaming"
                >
                  Stop Streaming
                </button>
                <button
                  @click="snapshot"
                >
                  Snapshot
                </button>
         </div>
        <video ref="videoRef" autoplay="true" width="100" id="video"/>
        <div class="bg-gray-300 h-64 w-64 rounded-lg shadow-md bg-cover bg-center">
          <img class="w-64" ref="imgRef" src="https://images.unsplash.com/photo-1503792501406-2c40da09e1e2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=752&q=80"
           alt="sciscors" crossorigin="anonymous">
        </div>
          <button
                @click="detect"
              >
                <span v-if="isLoading">Loading ... </span>
                <span v-else>Detect Object</span>
          </button>
        <div v-if="result.length > 0">
                <p>{{ result[0].class }}</p>
            </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { ref } from "vue";
  import { defineComponent } from 'vue';
  require('@tensorflow/tfjs-backend-cpu')
  require('@tensorflow/tfjs-backend-webgl')
  const cocoSsd = require('@tensorflow-models/coco-ssd')
  const video = document.getElementById("video") as HTMLVideoElement;
  const img = document.getElementById("video") as HTMLImageElement;
  export default defineComponent({
    name: 'App',
    setup(){
      const imgRef = ref(img);
      const isLoading = ref(false);
      const videoRef = ref<HTMLVideoElement>(video);
      const isStreaming = ref(false);
      const result = ref([]);
  
      async function detect() {
        const img = imgRef.value;
        const model = await cocoSsd.load();
        const predictions = await model.detect(img);
        result.value = predictions;
        isLoading.value = false;
        console.log(predictions, img);
      }  
      async function openCamera() {
        if (navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({video: true}).then((stream)=>{
             isStreaming.value = true;
             
            videoRef.value.srcObject = stream;
          })
        }
      }
      function stopStreaming() {
        const stream = videoRef.value.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.map((track) => track.stop());
        isStreaming.value = false;
      }
      function snapshot() {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.drawImage(videoRef.value, 0, 0, 200, 200);
        const data = canvas.toDataURL("image/png");
        imgRef.value.setAttribute("src", data);
      }
    
      return {
        imgRef,
        detect,
        result,
        isStreaming,
        videoRef,
        openCamera,
        stopStreaming,
        snapshot,
      }
    }
  });
  </script>
  
  <style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  </style>
  