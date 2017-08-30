import Hammer from 'hammerjs'
import { isEmpty } from 'lodash'

const gestures = ['tap', 'pan', 'pinch', 'press', 'rotate', 'swipe']
const directions = ['up', 'down', 'left', 'right', 'horizontal', 'vertical', 'all']

export const VueHammer = {
  config: {},
  customEvents: {},
  install: function(Vue) {
    const that = this
    Vue.directive('hammer', {
      bind(el, binding) {
        if (!el.hammer) {
          el.hammer = new Hammer.Manager(el)
        }
        const mc = that.mc = el.hammer

        // determine event type
        const event = binding.arg
        if (!event) {
          console.warn('[vue-hammer] event type argument is required.')
        }
        that.config[event] = {}

        const direction = binding.modifiers
        if (!isEmpty(direction)) {
          Object.keys(direction).map(keyName => {
            that.config[event].direction = String(keyName)
          })
        }

        let recognizerType, recognizer

        if (that.customEvents[event]) {
          // custom event
          const custom = that.customEvents[event]
          recognizerType = custom.type
          recognizer = new Hammer[that.capitalize(recognizerType)](custom)
          recognizer.recognizeWith(mc.recognizers)
          mc.add(recognizer)
        } else {
          // built-in event
          recognizerType = gestures.find(gesture => gesture === event)
          if (!recognizerType) {
            console.warn('[vue-hammer] invalid event type: ' + event)
            return
          }
          recognizer = mc.get(recognizerType)
          if (!recognizer) {
            // add recognizer
            recognizer = new Hammer[that.capitalize(recognizerType)]()
            // make sure multiple recognizers work together...
            recognizer.recognizeWith(mc.recognizers)
            mc.add(recognizer)
          }
          // apply global options
          const globalOptions = VueTouch.config[recognizerType]
          if (globalOptions) {
            that.guardDirections(globalOptions)
            recognizer.set(globalOptions)
          }
          // apply local options
          const localOptions =
            el.hammerOptions &&
            el.hammerOptions[recognizerType]
          if (localOptions) {
            that.guardDirections(localOptions)
            recognizer.set(localOptions)
          }
        }
        that.recognizer = recognizer

        update(el, binding)
      },
      update(el, binding) {
        const mc = that.mc
        const event = binding.arg
        // teardown old handler
        if (that.handler) {
          mc.off(event, that.handler)
        }
        if (typeof binding.value !== 'function') {
          that.handler = null
          console.warn(
            '[vue-hammer] invalid handler function for v-touch: ' +
            binding.arg
          )
        } else {
          mc.on(event, (that.handler = binding.value))
        }
      },
      unbind(el, binding) {
        if (that.handler) {
          that.mc.off(binding.arg, that.handler)
        }
        if (!Object.keys(that.mc.handlers).length) {
          that.mc.destroy()
          el.hammer = null
        }
      },
    })
  },
  guardDirections(options) {
    var dir = options.direction
    if (typeof dir === 'string') {
      var hammerDirection = 'DIRECTION_' + dir.toUpperCase()
      if (directions.indexOf(dir) > -1 && Hammer.hasOwnProperty(hammerDirection)) {
        options.direction = Hammer[hammerDirection]
      } else {
        console.warn('[vue-hammer] invalid direction: ' + dir)
      }
    }
  },
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  },
}

