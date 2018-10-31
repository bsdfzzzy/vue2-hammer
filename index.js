import Hammer from 'hammerjs'

const gestures = ['tap', 'pan', 'pinch', 'press', 'rotate', 'swipe']
const subGestures = ['panstart', 'panend', 'panmove', 'pancancel', 'pinchstart', 'pinchmove', 'pinchend', 'pinchcancel', 'pinchin', 'pinchout', 'pressup', 'rotatestart', 'rotatemove', 'rotateend', 'rotatecancel']
const directions = ['up', 'down', 'left', 'right', 'horizontal', 'vertical', 'all']

export const VueHammer = {
  config: {},
  customEvents: {},
  install(Vue) {
    Vue.directive('hammer', {
      bind: (el, binding) => {
        if (!el.hammer) {
          el.hammer = new Hammer.Manager(el)
        }
        const mc = el.hammer

        // determine event type
        const event = binding.arg
        if (!event) {
          console.warn('[vue-hammer] event type argument is required.')
        }
        el.__hammerConfig = el.__hammerConfig || {}
        el.__hammerConfig[event] = {}

        const direction = binding.modifiers
        el.__hammerConfig[event].direction = el.__hammerConfig[event].direction || []
        if (Object.keys(direction).length) {
          Object.keys(direction)
            .filter(keyName => binding.modifiers[keyName])
            .forEach(keyName => {
              const elDirectionArray = el.__hammerConfig[event].direction
              if (elDirectionArray.indexOf(keyName) === -1) {
                elDirectionArray.push(String(keyName))
              }
            })
        }

        let recognizerType,
          recognizer

        if (this.customEvents[event]) {
          // custom event
          const custom = this.customEvents[event]
          recognizerType = custom.type
          recognizer = new Hammer[this.capitalize(recognizerType)](custom)
          recognizer.recognizeWith(mc.recognizers)
          mc.add(recognizer)
        } else {
          // built-in event
          recognizerType = gestures.find(gesture => gesture === event)
          const subGesturesType = subGestures.find(gesture => gesture === event)
          if (!recognizerType && !subGesturesType) {
            console.warn('[vue-hammer] invalid event type: ' + event)
            return
          }
          if (subGesturesType && el.__hammerConfig[subGesturesType].direction.length !== 0) {
            console.warn('[vue-hammer] ' + subGesturesType + ' should not have directions')
          }
          if (!recognizerType) {
            return
          }
          if (recognizerType === 'tap' || recognizerType === 'pinch' || recognizerType === 'press' || recognizerType === 'rotate') {
            if (el.__hammerConfig[recognizerType].direction.length !== 0) {
              throw Error('[vue-hammer] ' + recognizerType + ' should not have directions')
            }
          }
          recognizer = mc.get(recognizerType)
          if (!recognizer) {
            // add recognizer
            recognizer = new Hammer[this.capitalize(recognizerType)]()
            // make sure multiple recognizers work together...
            recognizer.recognizeWith(mc.recognizers)
            mc.add(recognizer)
          }
          // apply global options
          const globalOptions = this.config[recognizerType]
          if (globalOptions) {
            this.guardDirections(globalOptions)
            recognizer.set(globalOptions)
          }
          // apply local options
          const localOptions = el.hammerOptions &&
          el.hammerOptions[recognizerType]
          if (localOptions) {
            this.guardDirections(localOptions)
            recognizer.set(localOptions)
          }
        }
      },
      inserted: (el, binding) => {
        const mc = el.hammer
        const event = binding.arg
        const eventWithDir = subGestures.find(subGes => subGes === event) ? event : this.buildEventWithDirections(event, el.__hammerConfig[event].direction)
        if (mc.handler) {
          mc.off(eventWithDir, mc.handler)
        }
        if (typeof binding.value !== 'function') {
          mc.handler = null
          console.warn(
            '[vue-hammer] invalid handler function for v-hammer: ' +
            binding.arg
          )
        } else {
          mc.on(eventWithDir, (mc.handler = binding.value))
        }
      },
      componentUpdated: (el, binding) => {
        const mc = el.hammer
        const event = binding.arg
        const eventWithDir = subGestures.find(subGes => subGes === event) ? event : this.buildEventWithDirections(event, el.__hammerConfig[event].direction)
        // teardown old handler
        if (mc.handler) {
          mc.off(eventWithDir, mc.handler)
        }
        if (typeof binding.value !== 'function') {
          mc.handler = null
          console.warn(
            '[vue-hammer] invalid handler function for v-hammer: ' +
            binding.arg
          )
        } else {
          mc.on(eventWithDir, (mc.handler = binding.value))
        }
      },
      unbind: (el, binding) => {
        const mc = el.hammer
        const event = binding.arg
        const eventWithDir = subGestures.find(subGes => subGes === event) ? event : this.buildEventWithDirections(event, el.__hammerConfig[event].direction)
        if (mc.handler) {
          el.hammer.off(eventWithDir, mc.handler)
        }
        if (!Object.keys(mc.handlers).length) {
          el.hammer.destroy()
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
  buildEventWithDirections(eventName, directionArray) {
    const f = {}
    directionArray.forEach(dir => {
      dir = dir.toLowerCase()
      if (dir === 'horizontal') {
        f.left = 1
        f.right = 1
      } else if (dir === 'vertical') {
        f.up = 1
        f.down = 1
      } else if (dir === 'all') {
        f.left = 1
        f.right = 1
        f.up = 1
        f.down = 1
      } else {
        f[dir] = 1
      }
    })
    const _directionArray = Object.keys(f)
    if (_directionArray.length === 0) {
      return eventName
    }
    const eventWithDirArray = _directionArray.map(dir => {
      return eventName + dir
    })
    return eventWithDirArray.join(' ')
  },
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  },
}