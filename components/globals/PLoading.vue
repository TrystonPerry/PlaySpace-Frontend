<template>
  <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
</template>

<script>
export default {
  props: {}
}
</script>

<style scoped>
.lds-ring {
  margin: auto;
  position: relative;
  max-width: 36px;
  max-height: 36px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 32px;
  height: 32px;
  margin: 2px;
  border: 2px solid #009dee;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #009dee transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>