<template>
  <transition name="ami-mask">
    <div v-if="state" :style="{ zIndex }" :class="classArr"></div>
  </transition>
</template>

<script>
import popupManager from "./popupManager";

export default {
  name: "AmiMask",
  data: () => ({
    state: false,
    zIndex: 0,
    classArr: ["ami-mask"]
  }),
  created: function() {
    popupManager.maskRegister(this)
  },
  beforeDestroy: function() {
    popupManager.maskDeRegister(this)
  },
  methods: {
    toggle: function(nextState, nextZIndex = 2000) {
      this.state = nextState
      this.zIndex = nextZIndex
    }
  }
};
</script>

<style lang="scss" scoped>
.ami-mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: .5;
  background: #000;
}
.ami-mask-enter, .ami-mask-leave-to {
  opacity: 0;
}
.ami-mask-enter-active, .ami-mask-leave-active {
  transition: opacity .2s ease;
}
</style>