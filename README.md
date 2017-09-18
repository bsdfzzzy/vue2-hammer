# vue-hammer

Hammer.js wrapper for Vue to support some operation in the mobile

This is a directive wrapper for Hammer.js 2.x. And this repo'inspiration is from v-touch.

## Install

> This plugin supports Vue >= 2.0.

### npm

Available through npm as `vue2-hammer`.

```bash
npm install vue2-hammer
```

```Javascript
import { VueHammer } from 'vue2-hammer'
Vue.use(VueHammer)
```

## Usage

#### Using the `v-hammer` directive

``` html
<a v-hammer:tap="onTap">Tap me!</a>

<div v-hammer:swipeleft="onSwipeLeft">Swipe me!</div>
```

#### Configuring Recognizer Options

There are two ways to customize recognizer options such as `direction` and `threshold`. The first one is setting global options:

``` js
// change the threshold for all swipe recognizers
VueHammer.config.swipe = {
  threshold: 200
}
```

``` html
<a v-hammer:doubletap="onDoubleTap"></a>
```

See [Hammer.js documentation](http://hammerjs.github.io/getting-started/) for all available events.

## Run the Example

* Run ``` yarn ``` or ``` npm i ```
* Run ``` yarn build ``` or ``` npm run build ```
* Open the index.html in the example directory.

## License

[MIT](http://opensource.org/licenses/MIT)
