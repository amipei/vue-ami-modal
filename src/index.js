import AmiMask from './AmiMask';
import Modal from './Modal';
import popupManager from './popupManager'
const defaultComponentName = 'Modal'

const Plugin = {
  install: function (Vue, options ={}) {
    if (this.installed) return;

    this.installed = true
    this.popupManager = popupManager
    // 更改为单一模式
    this.popupManager.single = options.isSingle || false
    // 注册modal组件的使用名字
    const componentName = options.componentName || defaultComponentName

    // 实例化遮罩层
    const maskConstructor = Vue.extend(AmiMask)
    const maskEl = new maskConstructor().$mount().$el
    document.body.appendChild(maskEl)
    /**
     * Plugin 私有方法
     */
    const showStaticModal = (modalName, params) => {
      this.popupManager.toggle(modalName, true, params)
    }
    /**
     * Plugin Api(插件对外API)
     */
    Vue.prototype.$modal = {
      show: function (modalName, ...args) {
        switch (typeof modalName) {
          case 'string': {
            showStaticModal(modalName, ...args);break;
          }
          default: {
            console.warn("开发中");break;
          }
        }
      },
      hide: function (modalName) {
        Plugin.popupManager.toggle(modalName, false)
      },
      hideAll: function () {
        Plugin.popupManager.toggle("closeAll", false)
      },
    }
    /**
     * 注册组件
     */
    Vue.component(componentName, Modal)
  }
}

export default Plugin