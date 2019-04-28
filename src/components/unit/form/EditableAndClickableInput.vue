<template>
  <div :class="divClass">
    <input v-if="editable && type==='input'" v-model="valueCopy" :class="inputClass" :name="name" :placeholder="placeholder" @blur="completeEditValue"/>
    <!-- <span  v-if="editable && !nullable && type==='input'" class="mdi mdi-close pointer"></span> -->
    <select2 v-if="editable && type==='select'" :name="name" :value="valueCopy" :options="options" @update="selectedValue"></select2>
    <textarea v-if="editable && type==='textarea'" v-model="valueCopy" :class="inputClass" :ref="name" type="textarea" :name="name" :placeholder="placeholder" @blur="completeEditValue"></textarea>
    <a v-if="!editable && type==='input'" class="address" @click="valueClicked">{{valueCopy}}</a>
    <a v-if="!editable && type==='select'" class="address" @click="valueClicked">{{selectLabel}}</a>
    <div v-if="!editable && type==='textarea'" class="column">
      <a v-for="(url, index) in valueCopy.split('\n')" :key="index" class="address" @click="valueClicked(url)">{{url}}</a>
    </div>
    <a v-if="!editable" style="float: right;" @click="editValue">{{editLabel}}</a>
  </div>
</template>

<script>
import Select2 from '@/components/unit/form/Select2'

export default {
  name: 'EditableAndClickableInput',
  components: {
    Select2
  },
  data () {
    return {
      valueCopy: '',
      selectLabel: '',
      divClass: '',
      editable: false // 控制是否可以编辑的状态
    }
  },
  // computed: {
  //   nullable () {
  //     return this.valueCopy == null || this.valueCopy === ''
  //   }
  // },
  props: {
    // 可以是 input select textarea
    type: {
      type: String,
      default: 'input'
    },
    name: {
      type: String
    },
    editLabel: {
      type: String,
      default: '修改'
    },
    value: {
      type: String | null
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    routeStyle: {
      type: String,
      default: 'blank'
    },
    inputClass: {
      type: String | null
    },
    // input类型的特有属性
    // clearable: {
    //   type: Boolean,
    //   default: true
    // },
    // 以下为type=select特有的属性
    options: {
      // 生成下拉的原始数据
      type: Array
    },
    routerBaseUrl: {
      // 半自定义跳转url
      type: String | null
    }
  },
  mounted () {
    // 初始化状态
    if (this.value !== null && this.value !== '') {
      this.editable = false
    } else {
      this.editable = true
    }

    // 初始化input的内容
    this.valueCopy = this.value
  },
  watch: {
    value () {
      this.valueCopy = this.value
      if (this.valueCopy !== null && this.valueCopy !== '') {
        this.editable = false
      } else {
        this.editable = true
      }
      this.updateLabel()
    },
    options: {
      handler: function () {
        this.updateLabel()
      },
      deep: true
    }
  },
  methods: {
    editValue ($event) {
      this.editable = true
      if (this.type === 'input') {
        this.$nextTick(() => {
          window.$('input[name=' + this.name + ']').focus()
        })
      } else if (this.type === 'textarea') {
        this.$nextTick(() => {
          this.$refs[this.name].focus()
        })
      }
    },
    completeEditValue () {
      this.$emit('input', this.valueCopy)
      if (this.valueCopy !== null && this.valueCopy !== '') {
        this.editable = false
      } else {
        this.editable = true
      }
    },
    selectedValue (value) {
      this.valueCopy = value
      if (this.valueCopy) {
        let option = this.options.find(op => {
          return op.id === value
        })
        this.selectLabel = option.title
      } else {
        this.selectLabel = ''
      }
      this.completeEditValue()
    },
    valueClicked (url) {
      if (this.type === 'textarea' && url) {
        window.open(url)
        return
      }
      if (this.valueCopy === null || this.valueCopy === '') {
        // 没有跳转路径的url，放弃本次跳转操作
        return
      }
      let transformedUrl = this.getUrl()
      switch (this.routeStyle) {
        case 'blank':
          // 打开新的窗口 跳转
          window.open(transformedUrl)
          break
      }
    },
    updateLabel () {
      if (this.type === 'select' && this.valueCopy) {
        let value = this.valueCopy
        let option = this.options.find(op => {
          return op.id === value
        })
        if (option) {
          this.selectLabel = option.title
        } else {
          this.selectLabel = ''
        }
      }
    },
    getUrl () {
      if (this.type === 'select' && this.routerBaseUrl) {
        return '/#' + this.routerBaseUrl + '/' + this.valueCopy
      }
      return this.valueCopy
    }
  }
}
</script>

<style scoped>
  a {
    cursor: pointer;
    line-height: 37px;
  }
  a.address {
    display: inline-block;
    max-width: 80%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  div {
    line-height: 0;
    /* position: relative; */
  }
  span {
    position: absolute;
    top: 8px;
    right: 18px;
    font-size: 21px;
  }
  div.column {
    display: flex;
    flex-direction: column;
  }
</style>
