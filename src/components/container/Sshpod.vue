<template>
  <div id="xterm" class="xterm" />
</template>

<script>
import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { AttachAddon } from 'xterm-addon-attach'

export default {
  name: 'Sshpod',
  props: {
    socketURI: {
      type: String,
      default: 'ws://192.168.1.109:8001/api/pod/myapp-6d9468bfb8-8g4gg'
    }
  },
  mounted () {
    this.initSocket()
  },
  beforeDestroy () {
    this.socket.close()
    this.term.dispose()
  },
  methods: {
    initTerm () {
      const term = new Terminal({
        cursorStyle: 'underline',
        fontSize: 17,
        rows: 45,
        cursorBlink: true
      })
      const attachAddon = new AttachAddon(this.socket)
      const fitAddon = new FitAddon()
      term.loadAddon(attachAddon)
      term.loadAddon(fitAddon)
      term.open(document.getElementById('xterm'))
      fitAddon.fit()
      term.focus()
      this.term = term
    },
    initSocket () {
      // const url = window.location.href
      const mysocker = 'ws://192.168.3.79:8002/api/cluster=' + window.sessionStorage.getItem('cluster') + '&namespace=' + window.sessionStorage.getItem('namespace') + '&pod=' + this.$route.params.pod
      this.socket = new WebSocket(mysocker)
      this.socketOnClose()
      this.socketOnOpen()
      this.socketOnError()
    },
    socketOnOpen () {
      this.socket.onopen = () => {
        // 链接成功后
        this.initTerm()
      }
    },
    socketOnClose () {
      this.socket.onclose = () => {
        // console.log('close socket')
      }
    },
    socketOnError () {
      this.socket.onerror = () => {
        // console.log('socket 链接失败')
      }
    }
  }
}
</script>

<style scoped>

</style>
