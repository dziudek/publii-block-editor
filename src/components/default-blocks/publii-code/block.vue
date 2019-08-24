<template>
  <div>
    <prism-editor
      :class="{ 'publii-block-code': true }"
      ref="block"
      @paste="pastePlainText"
      @keyup="handleKeyboard"
      :code="content"
      :emitEvents="true"
      v-model="content"
      :lineNumbers="true"
      :language="config.language">
    </prism-editor>

    <div class="publii-block-code-lang">
      <vue-select
        :options="availableLanguages"
        v-model="config.language" />
    </div>

    <top-menu
      ref="top-menu"
      :conversions="conversions"
      :config="[]" />
  </div>
</template>

<script>
import AvailableConversions from './conversions.js';
import Block from './../../Block.vue';
import ConfigForm from './config-form.json';
import ContentEditableImprovements from './../../helpers/ContentEditableImprovements.vue';
import TopMenuUI from './../../helpers/TopMenuUI.vue';
import vSelect from 'vue-multiselect/dist/vue-multiselect.min.js';

export default {
  name: 'Code',
  mixins: [
    Block,
    ContentEditableImprovements
  ],
  components: {
    'top-menu': TopMenuUI,
    'vue-select': vSelect
  },
  data () {
    return {
      config: {
        language: 'html',
        advanced: {
          cssClasses: this.getAdvancedConfigDefaultValue('cssClasses'),
          id: this.getAdvancedConfigDefaultValue('id')
        }
      },
      content: '',
      conversions: AvailableConversions
    };
  },
  computed: {
    availableLanguages () {
      return [
        'apacheconf',
        'aspnet',
        'bash',
        'basic',
        'batch',
        'c',
        'cpp',
        'csharp',
        'css',
        'dart',
        'docker',
        'elm',
        'git',
        'glsl',
        'go',
        'graphql',
        'haml',
        'handlebars',
        'haskell',
        'html',
        'http',
        'ini',
        'java',
        'javascript',
        'json',
        'jsonp',
        'jsx',
        'kotlin',
        'latex',
        'less',
        'lisp',
        'lua',
        'makefile',
        'markdown',
        'matlab',
        'nasm',
        'nginx',
        'objectivec',
        'pascal',
        'perl',
        'php',
        'pug',
        'python',
        'r',
        'regex',
        'ruby',
        'sass',
        'scss',
        'scala',
        'sql',
        'swift',
        'twig',
        'typescript',
        'vbnet',
        'visual-basic',
        'yaml'
      ]
    }
  },
  beforeCreate () {
    this.configForm = ConfigForm;
  },
  mounted () {
    this.content = this.inputContent;
  },
  methods: {
    focus () {
      this.$refs['block'].$el.querySelector('pre').focus();
    },
    handleKeyboard (e) {
      if (e.code === 'Enter' && e.shiftKey === true) {
        this.$bus.$emit('block-editor-add-block', 'publii-paragraph', this.id);
        e.returnValue = false;
      }

      if (e.code === 'Tab' && e.shiftKey === false) {
        e.preventDefault();
        // eslint-disable-next-line
        document.execCommand('insertHTML', false, "  ");
        e.returnValue = false;
      }

      if (e.code === 'Backspace' && this.$refs['block'].code === '') {
        this.$bus.$emit('block-editor-delete-block', this.id);
        e.returnValue = false;
      }
    },
    save () {
      this.content = this.$refs['block'].code;

      this.$bus.$emit('block-editor-save-block', {
        id: this.id,
        config: JSON.parse(JSON.stringify(this.config)),
        content: this.content
      });
    }
  }
}
</script>

<style lang="scss">
@import '../../../vendors/mappy-breakpoints';  
@import '../../../vendors/modularscale'; 
@import '../../../assets/functions.scss';
@import '../../../assets/variables.scss';
@import '../../../assets/mixins.scss';  

.publii-block-code {
    background: $block-editor-color-code-bg;
    border-radius: $block-editor-form-input-border-radius;
    box-shadow: 2px 4px 26px $block-editor-color-shadow;
    outline: none;
    width: 100%;

    &:empty {
        &:before {
            content: 'Enter code';
            opacity: .35;
        }
    }

    & > .prism-editor__line-numbers {
        display: block;
    }

    & > pre {
        background: $block-editor-color-code-bg !important;
        display: block;

        &:empty {
            &:before {
                content: 'Enter HTML code';
                opacity: .35;
            }
        }

        code {
            background: transparent !important;
            padding: 0 !important;
        }
    }

    &-lang {
        position: absolute;
        right: 40px;
        top: 24px;

        .multiselect__content {
            margin: 0 !important;
        }

        .multiselect__element {
            padding: 0 !important;
        }

        .multiselect__option:after {
            display: none;
        }
    }

    & + .publii-block-code-lang {

        .multiselect {            

            &__tags {
                background: #3b3f48;
                border: none;               
            }           

            &__single {
                background: inherit;
                color: $block-editor-color-light-dark;
            }

            &__select {                
                &::before {
                    border-color: $block-editor-color-text-medium transparent transparent;
                }
            }
            
            &__content-wrapper {
                 background: #3b3f48;
                 border: none;     color: $block-editor-color-light-dark;
            }

            &__option {
                padding: 7px;
                min-height: 30px;

                &--highlight {
                    background: $block-editor-color-primary;
                }

                &.multiselect__option--selected {
                    background: $block-editor-color-primary;
                    color: $block-editor-color-light;
                }
            }

            &__input {
                background: none !important;
                
                &::placeholder {
                     color: $block-editor-color-light-dark;
                }
            }
        }
    }
}

</style>
