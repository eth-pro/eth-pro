<template>
    <div class="btn-group">
        <li @click="toggleMenu()" class="dropdown-toggle" v-if="selectedOption !== undefined">{{ selectedOption.name }}<span class="caret"></span></li>

        <li @click="toggleMenu()" class="dropdown-toggle" v-if="selectedOption === undefined"><img class="image" :src="placeholderText"/></li>

        <ul class="dropdown-menu" v-if="showMenu">
            <li v-for="(option, index) in options" :key="index" :class="{active:selectedOption == option}">
                <a href="javascript:void(0)" @click="updateOption(option, index)">
                    <!-- {{ option }} -->
                    <img class="image" :src="option"/>
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      selectedOption: '',
      showMenu: false,
      placeholderText: ''
    }
  },
  props: {
    options: {
      type: [Array, Object]
    },
    selected: {},
    placeholder: [String]
  },
  watch: {
    selected: function(value) {
      this.selectedOption = _.find(this.options, { value: this.selected })
      this.placeholderText = this.selected
    }
  },
  mounted() {
    this.selectedOption = _.find(this.options, { value: this.selected })
    this.placeholderText = this.selected
  },

  methods: {
    updateOption(option, index) {
      this.placeholderText = option
      this.showMenu = false
      this.$emit('updateOption', this.placeholderText, index)
    },

    toggleMenu() {
      this.showMenu = !this.showMenu
    }
  }
}

</script>

<style lang="scss" scoped>
.btn-group {
  position: relative;
  min-width: 90px;
  display: inline-block;
  font-size: 24px;
}
.btn-group a:hover {
  text-decoration: none;
}

.dropdown-toggle {
  position: relative;
  color: #fff;
  min-width: 90px;
  top: 50%;
  transform: translateY(-50%);
  line-height: 24px;
  text-align: right;
  margin-bottom: 0;
  border: none;
  background-color: transparent;
  transition: background 0s ease-out;
  box-shadow: none;
  border-radius: none;
}
.dropdown-toggle:hover {
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 80%;
  right: 0;
  z-index: 1000;
  float: left;
  padding: 0;
  margin: 0;
  list-style: none;
  font-size: 24px;
  text-align: left;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  background-clip: padding-box;

  a {
    text-align: center;
  }

  li {
    &.active {
      background-color: #e4e4e4;
    }
    background: #12151d;
    padding: 10px 4px;
    
  }
}
.image {
  width: 42px;
  height: 28px;
}
.dropdown-menu > li > a {
  display: block;
  clear: both;
  font-weight: normal;
  line-height: 0;
  color: #3b3b3b;
  white-space: nowrap;
  text-decoration: none;
}
.dropdown-menu > li > a:hover {
  background: #efefef;
}

.dropdown-menu > li {
  overflow: hidden;
  width: 100%;
  position: relative;
  margin: 0;
}

.caret {
  display: inline-block;
  width: 0;
  height: 0;
  margin-left: 2px;
  vertical-align: middle;
  border-top: 10px dashed #fff;
  border-right: 10px solid transparent;
  border-left: 10px solid transparent;
  margin-left: 10px;
}

li {
  list-style: none;
}
</style>