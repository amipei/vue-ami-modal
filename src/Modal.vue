<template>
  <div
    v-show="visible"
    :style="{zIndex}"
    class="ami--modal__wrapper"
    @click.self="handleContainerClick"
  >
    <div :style="styleObj" class="ami--modal" v-scroll-lock>
      <slot></slot>
    </div>
  </div>
</template>

<script>
//import { generateId } from './utils/index'
import popupManager from "./popupManager";

export default {
  name: "AmiModal",
  props: {
    name: {
      type: String,
      required: true
    },
    lockScroll: {
      type: Boolean,
      default: true
    },
    width: {
      type: [String, Number],
      default: "50%"
    },
    height: {
      type: [String, Number],
      default: "auto"
    }
  },
  beforeMount: function() {
    popupManager.modalRegister(this.name, this);
  },
  beforeDestroy: function() {
    popupManager.modalDeRegister(this.name);
  },
  data: () => ({
    visible: false,
    zIndex: 0
  }),
  computed: {
    styleObj: function() {
      return {
        width: this.width,
        height: this.height,
        overflowY: "auto"
      };
    }
  },
  methods: {
    handleContainerClick: function() {
      popupManager.toggle(this.name, false);
    },
    open: function(nextZIndex) {
      this.visible = true;
      this.zIndex = nextZIndex;
    },
    close: function() {
      this.visible = false;
      this.zIndex = 0;
    }
  }
};
</script>

<style lang="scss" scoped>
.ami--modal__wrapper {
  position: fixed;
  left: 0;
  top: 0;
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  z-index: 2001;
}
.ami--modal {
  position: relative;
  margin: 0 auto;
  margin-top: 15vh;
  background: #fff;
  box-sizing: border-box;
}
</style>