import Vue from 'vue';

const rise = 2

const popupManager = new Vue({
  data: () => ({
    maskInstance: null,
    instances: {},
    modalStack: [],
    zIndex: 2000,
    single: false
  }),
  methods: {
    /**
     * 遮罩层和模态实例注册/解除
     */
    maskRegister: function (instance) {
      this.maskInstance = instance
    },
    maskDeRegister: function () {
      this.maskInstance = null
    },
    modalRegister: function (name, instance) {
      if (name && instance) {
        this.$set(this.instances, name, instance)
      }
    },
    modalDeRegister: function (name) {
      if (name) {
        this.$delete(this.instances, name)
      }
    },
    nextZiIndex: function () {
      return this.zIndex += rise
    },
    toggle: function (modalName, state, params) {
      // 检查是否关闭全部
      if (modalName === "closeAll" && state === false) {
        this.closeAllModal()
        return
      }
      // 检查是否是单一modal
      if (this.single) {
        this.singleToggle(modalName, state)
        return
      }
      // 检查是否同一modal(不同状态)
      if (state) {
        for (let i = 0, j = this.modalStack.length; i < j; i++) {
          const item = this.modalStack[i]
          if (item.name === modalName) {
            return;
          }
        }
        this.openModal(modalName, params)
      } else {
        if (this.modalStack.length === 0) return;
        this.closeModal(modalName)
      }
    },
    singleToggle: function (modalName, state) {
      if (!state) {
        this.closeModal(modalName)
        return
      }

      let modalZIndex = this.nextZiIndex()
      let maskZIndex = modalZIndex - 1
      this.modalStack.splice(0, 0, {
        name: modalName,
        modalZIndex,
        maskZIndex
      })
      if (this.modalStack.length > 1) {
        const topItem = this.modalStack[this.modalStack.length - 1]
        this.closeModal(topItem.name)
      } else {
        this.maskInstance.toggle(true, maskZIndex)
      }
      this.instances[modalName].open(modalZIndex)
    },
    openModal: function (modalName) {
      //获取 modal和mask的层级 
      let modalZIndex = this.nextZiIndex()
      let maskZIndex = modalZIndex - 1
      this.modalStack.push({
        name: modalName,
        modalZIndex,
        maskZIndex
      })
      // 触发/改变 Mask层
      this.maskInstance.toggle(true, maskZIndex)
      this.instances[modalName].open(modalZIndex)
    },
    closeModal: function (modalName) {
      let item = null
      const topItem = this.modalStack[this.modalStack.length - 1]
      if (topItem.name === modalName) {
        item = this.modalStack.pop()
      } else {
        for (let i = this.modalStack.length - 1; i >= 0; i--) {
          if (this.modalStack[i].name === modalName) {
            item = this.modalStack.splice(i, 1);
            break;
          }
        }
      }
      // 关闭modal
      if (item) {
        let instance = this.instances[modalName]
        instance.close()
      }

      if (this.modalStack.length > 0) {
        let maskZIndex = this.modalStack[this.modalStack.length - 1].maskZIndex
        this.maskInstance.toggle(true, maskZIndex)
        return
      }
      if (this.modalStack.length === 0) {
        this.maskInstance.toggle(false)
      }
    },
    // 关闭全部
    closeAllModal: function () {
      this.modalStack.splice(0, this.modalStack.length)
      this.maskInstance.toggle(false)
      for (let key in this.instances) {
        this.instances[key].close()
      }
    },
  }
})

export default popupManager