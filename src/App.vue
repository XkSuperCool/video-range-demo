<script setup lang="ts">
import { ref, watchPostEffect } from 'vue'

let size = 0
fetch('/test/size')
  .then(res => res.json())
  .then((res) => {
    size = res
  })

let current = 0
const video = ref<HTMLVideoElement>()
const mediaSource = new MediaSource()
const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
mediaSource.addEventListener('sourceopen', sourceOpen)

function loadVideoBuffer() {
  if (current >= size)
    return Promise.resolve()

  return fetch('/test/frag_bunny.mp4', {
    headers: {
      Range: `bytes=${current}-${current + 300000}`,
    },
  }).then((res) => {
    current = Math.min(current += 300001, size)
    return res.arrayBuffer()
  })
}

function sourceOpen() {
  const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec)

  sourceBuffer.onerror = (error) => {
    console.error('error', error)
  }

  loadVideoBuffer().then((res) => {
    sourceBuffer.appendBuffer(res!)
    video.value!.play()
    const timer = setInterval(() => {
      loadVideoBuffer().then((buf) => {
        if (!buf)
          return clearInterval(timer)

        sourceBuffer.appendBuffer(buf)
      })
    }, 2000)
  })
}
watchPostEffect(() => {
  setTimeout(() => {
    video.value!.src = URL.createObjectURL(mediaSource)
  }, 1000)
})
</script>

<template>
  <video ref='video' controls muted />
</template>
