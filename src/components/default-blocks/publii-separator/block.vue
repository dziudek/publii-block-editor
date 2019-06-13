<template>
  <div>
    <div
      class="publii-block-separator"
      contenteditable="true"
      @keyup="getFocusFromTab($event); handleCaret($event)"
      @paste="pastePlainText"
      ref="block">
      <hr :class="config.type" />
    </div>

    <top-menu
      ref="top-menu"
      :config="topMenuConfig" />
  </div>
</template>

<script>
import Block from './../../Block.vue';
import TopMenuUI from './../../helpers/TopMenuUI.vue';

export default {
  name: 'Separator',
  mixins: [
    Block
  ],
  components: {
    'top-menu': TopMenuUI
  },
  data () {
    return {
      config: {
        type: 'long'
      },
      content: '',
      topMenuConfig: [
        {
          activeState: function () { return this.config.type === 'long'; },
          onClick: function () { this.setType('long'); },
          icon: 'long-line'
        },
        {
          activeState: function () { return this.config.type === 'medium'; },
          onClick: function () { this.setType('medium'); },
          icon: 'shorter-line'
        },
        {
          activeState: function () { return this.config.type === 'short'; },
          onClick: function () { this.setType('short'); },
          icon: 'short-line'
        },
        {
          activeState: function () { return this.config.type === 'dots'; },
          onClick: function () { this.setType('dots'); },
          icon: 'dotted-line'
        },
        {
          activeState: function () { return this.config.type === 'dot'; },
          onClick: function () { this.setType('dot'); },
          icon: 'dot'
        },
        {
          activeState: () => false,
          onClick: () => false,
          icon: 'gear'
        }
      ]
    };
  },
  mounted () {
    this.$refs['block'].addEventListener('keydown', this.handleKeyboard);
  },
  methods: {
    handleKeyboard (e) {
      if (e.code === 'Enter') {
        this.$bus.$emit('block-editor-add-block', 'publii-paragraph', this.id);
        e.returnValue = false;
      }

      if (e.code === 'Backspace') {
        this.$bus.$emit('block-editor-delete-block', this.id);
        e.returnValue = false;
      }

      if (e.code !== 'Tab') {
        e.returnValue = false;
      }
    },
    setType (type) {
      this.config.type = type;
    },
    save () {
      this.$bus.$emit('block-editor-save-block', {
        id: this.id,
        config: JSON.parse(JSON.stringify(this.config)),
        content: this.content
      });
    }
  },
  beforeDestroy () {
    this.$refs['block'].removeEventListener('keydown', this.handleKeyboard);
  }
}
</script>

<style lang="scss">
.publii-block-separator {
  caret-color: transparent;
  margin: 32px 0;
  outline: none;
  width: 100%;

  hr {
    margin: 5px auto;
    position: relative;
  }

  hr.long {
    width: 100%;
  }

  hr.medium {
    width: 50%;
  }

  hr.short {
    width: 25%;
  }

  hr.dots,
  hr.dot {
    border: none;
    height: 12px;
    margin: 0 auto;

    &:before {
      content: "* * *";
      left: 50%;
      line-height: 6px;
      position: absolute;
      top: 75%;
      transform: translateX(-50%) translateY(-50%);
    }
  }

  hr.dot {
    &:before {
      content: "*";
    }
  }
}
</style>
