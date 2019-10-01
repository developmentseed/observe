# Style

We use styled-components to created styled react-native components.

react-native has a set of style properties that overlap with css and has some differences.

This document details the available properties as written using styled-components.

This doesn't list all components.

Many components also have properties outside the `style` prop that impact visual rendering of the component.

To learn more see the react-native [docs on components and APIs](https://facebook.github.io/react-native/docs/components-and-apis).

## Contents
- [React Native components wrapped by styled-components]()
- [Text style props](#text-style-props)
- [View style props](#view-style-props)
- [Image style props](#image-style-props)

## React Native components wrapped by styled-components

These components are available via ``` styled.ComponentName`` ```

- [ActivityIndicator](https://facebook.github.io/react-native/docs/activityindicator)
- [ActivityIndicatorIOS](https://facebook.github.io/react-native/docs/activityindicatorios)
- [ART](https://facebook.github.io/react-native/docs/art)
- [Button](https://facebook.github.io/react-native/docs/button)
- [DatePickerIOS](https://facebook.github.io/react-native/docs/datepickerios)
- [DrawerLayoutAndroid](https://facebook.github.io/react-native/docs/drawerlayoutandroid)
- [Image](https://facebook.github.io/react-native/docs/image)
- [ImageBackground](https://facebook.github.io/react-native/docs/imagebackground)
- [ImageEditor](https://facebook.github.io/react-native/docs/imageeditor)
- [ImageStore](https://facebook.github.io/react-native/docs/imagestore)
- [KeyboardAvoidingView](https://facebook.github.io/react-native/docs/keyboardavoidingview)
- [ListView](https://facebook.github.io/react-native/docs/listview)
- [MapView](https://facebook.github.io/react-native/docs/mapview)
- [Modal](https://facebook.github.io/react-native/docs/modal)
- [NavigatorIOS](https://facebook.github.io/react-native/docs/navigatorios)
- [Picker](https://facebook.github.io/react-native/docs/picker)
- [PickerIOS](https://facebook.github.io/react-native/docs/pickerios)
- [ProgressBarAndroid](https://facebook.github.io/react-native/docs/progressbarandroid)
- [ProgressViewIOS](https://facebook.github.io/react-native/docs/progressviewios)
- [ScrollView](https://facebook.github.io/react-native/docs/scrollview)
- [SegmentedControlIOS](https://facebook.github.io/react-native/docs/segmentedcontrolios)
- [Slider](https://facebook.github.io/react-native/docs/slider)
- [SliderIOS](https://facebook.github.io/react-native/docs/sliderios)
- [SnapshotViewIOS](https://facebook.github.io/react-native/docs/snapshotviewios)
- [Switch](https://facebook.github.io/react-native/docs/switch)
- [RecyclerViewBackedScrollView](https://facebook.github.io/react-native/docs/recyclerviewbackedscrollview)
- [RefreshControl](https://facebook.github.io/react-native/docs/refreshcontrol)
- [SafeAreaView](https://facebook.github.io/react-native/docs/safeareaview)
- [StatusBar](https://facebook.github.io/react-native/docs/statusbar)
- [SwipeableListView](https://facebook.github.io/react-native/docs/swipeablelistview)
- [SwitchAndroid](https://facebook.github.io/react-native/docs/switchandroid)
- [SwitchIOS](https://facebook.github.io/react-native/docs/switchios)
- [TabBarIOS](https://facebook.github.io/react-native/docs/tabbarios)
- [Text](https://facebook.github.io/react-native/docs/text)
- [TextInput](https://facebook.github.io/react-native/docs/textinput)
- [ToastAndroid](https://facebook.github.io/react-native/docs/toastandroid)
- [ToolbarAndroid](https://facebook.github.io/react-native/docs/toolbarandroid)
- [Touchable](https://facebook.github.io/react-native/docs/touchable)
- [TouchableHighlight](https://facebook.github.io/react-native/docs/touchablehighlight)
- [TouchableNativeFeedback](https://facebook.github.io/react-native/docs/touchablenativefeedback)
- [TouchableOpacity](https://facebook.github.io/react-native/docs/touchableopacity)
- [TouchableWithoutFeedback](https://facebook.github.io/react-native/docs/touchablewithoutfeedback)
- [View](https://facebook.github.io/react-native/docs/view)
- [ViewPagerAndroid](https://facebook.github.io/react-native/docs/viewpagerandroid)
- [WebView](https://facebook.github.io/react-native/docs/webview)
- [FlatList](https://facebook.github.io/react-native/docs/flatlist)
- [SectionList](https://facebook.github.io/react-native/docs/sectionlist)
- [VirtualizedList](https://facebook.github.io/react-native/docs/virtualizedlist)

## Text style props

- [TextInput](https://facebook.github.io/react-native/docs/textinput)
  - supports most but not all Text style props. see https://facebook.github.io/react-native/docs/textinput#style

### Properties
- [`text-shadow-offset`](#text-shadow-offset)
- [`color`](#color)
- [`font-size`](#font-size)
- [`font-style`](#font-style)
- [`font-weight`](#font-weight)
- [`line-height`](#line-height)
- [`text-align`](#text-align)
- [`text-decoration-line`](#text-decoration-line)
- [`text-shadow-color`](#text-shadow-color)
- [`font-family`](#font-family)
- [`text-shadow-radius`](#text-shadow-radius)
- [`include-font-padding`](#include-font-padding)
- [`text-align-vertical`](#text-align-vertical)
- [`font-variant`](#font-variant)
- [`letter-spacing`](#letter-spacing)
- [`text-decoration-color`](#text-decoration-color)
- [`text-decoration-style`](#text-decoration-style)
- [`text-transform`](#text-transform)
- [`writing-direction`](#writing-direction)

#### `text-shadow-offset`
| Type                                   | Required |
| -------------------------------------- | -------- |
| object: {width: number,height: number} | No       |

---

#### `color`
| Type               | Required |
| ------------------ | -------- |
| [color](colors.md) | No       |

---

#### `font-size`
| Type   | Required |
| ------ | -------- |
| number | No       |

---

#### `font-style`
| Type                     | Required |
| ------------------------ | -------- |
| enum('normal', 'italic') | No       |

---

#### `font-weight`
Specifies font weight. The values 'normal' and 'bold' are supported for most fonts. Not all fonts have a variant for each of the numeric values, in that case the closest one is chosen.

| Type                                                                                  | Required |
| ------------------------------------------------------------------------------------- | -------- |
| enum('normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900') | No       |

---

#### `line-height`
| Type   | Required |
| ------ | -------- |
| number | No       |

---

#### `text-align`
Specifies text alignment. The value 'justify' is only supported on iOS and fallbacks to `left` on Android.

| Type                                               | Required |
| -------------------------------------------------- | -------- |
| enum('auto', 'left', 'right', 'center', 'justify') | No       |

---

#### `text-decoration-line`
| Type                                                                | Required |
| ------------------------------------------------------------------- | -------- |
| enum('none', 'underline', 'line-through', 'underline line-through') | No       |

---

#### `text-shadow-color`
| Type               | Required |
| ------------------ | -------- |
| [color](colors.md) | No       |

---

#### `font-family`
| Type   | Required |
| ------ | -------- |
| string | No       |

---

#### `text-shadow-radius`
| Type   | Required |
| ------ | -------- |
| number | No       |

---

#### `include-font-padding`
Set to `false` to remove extra font padding intended to make space for certain ascenders / descenders. With some fonts, this padding can make text look slightly misaligned when centered vertically. For best results also set `textAlignVertical` to `center`. Default is true.

| Type | Required | Platform |
| ---- | -------- | -------- |
| bool | No       | Android  |

---

#### `text-align-vertical`
| Type                                    | Required | Platform |
| --------------------------------------- | -------- | -------- |
| enum('auto', 'top', 'bottom', 'center') | No       | Android  |

---

#### `font-variant`
| Type                                                                                             | Required | Platform |
| ------------------------------------------------------------------------------------------------ | -------- | -------- |
| array of enum('small-caps', 'oldstyle-nums', 'lining-nums', 'tabular-nums', 'proportional-nums') | No       | iOS      |

---

#### `letter-spacing`
| Type   | Required | Platform            |
| ------ | -------- | ------------------- |
| number | No       | iOS, Android >= 5.0 |

---

#### `text-decoration-color`
| Type               | Required | Platform |
| ------------------ | -------- | -------- |
| [color](colors.md) | No       | iOS      |

---

#### `text-decoration-style`
| Type                                        | Required | Platform |
| ------------------------------------------- | -------- | -------- |
| enum('solid', 'double', 'dotted', 'dashed') | No       | iOS      |

---

#### `text-transform`
| Type                                                 | Required |
| ---------------------------------------------------- | -------- |
| enum('none', 'uppercase', 'lowercase', 'capitalize') | No       |

---

#### `writing-direction`
| Type                       | Required | Platform |
| -------------------------- | -------- | -------- |
| enum('auto', 'ltr', 'rtl') | No       | iOS      |

## View style props

These style props work with the [View component]() and are applicable to these components as well:
- [ActivityIndicator](https://facebook.github.io/react-native/docs/activityindicator)
- [Button](https://facebook.github.io/react-native/docs/button)
- [DrawerLayoutAndroid](https://facebook.github.io/react-native/docs/drawerlayoutandroid)
- [FlatList](https://facebook.github.io/react-native/docs/flatlist)
- [ImageBackground](https://facebook.github.io/react-native/docs/imagebackground)
- [InputAccessoryView](https://facebook.github.io/react-native/docs/inputaccessoryview)
- [KeyboardAvoidingView](https://facebook.github.io/react-native/docs/keyboardavoidingview)
- [MaskedViewIOS](https://facebook.github.io/react-native/docs/maskedviewios)
- [NavigatorIOS](https://facebook.github.io/react-native/docs/navigatorios)
- [ProgressViewAndroid](https://facebook.github.io/react-native/docs/progressviewandroid)
- [ProgressViewIOS](https://facebook.github.io/react-native/docs/progressviewios)
- [RefreshControl](https://facebook.github.io/react-native/docs/refreshcontrol)
- [SafeAreaView](https://facebook.github.io/react-native/docs/safeareaview)
- [ScrollView](https://facebook.github.io/react-native/docs/scrollview)
- [SectionList](https://facebook.github.io/react-native/docs/sectionlist)
- [SegmentedControlIOS](https://facebook.github.io/react-native/docs/segmentedcontrolios)
- [Slider](https://facebook.github.io/react-native/docs/slider)
- [SnapshotViewIOS](https://facebook.github.io/react-native/docs/snapshotviewios)
- [TabBarIOS](https://facebook.github.io/react-native/docs/tabbarios)
- [TabBarIOS.Item](https://facebook.github.io/react-native/docs/tabbarios-item)
- [ToolbarAndroid](https://facebook.github.io/react-native/docs/toolbarandroid)
- [TouchableHighlight](https://facebook.github.io/react-native/docs/touchablehighlight)
- [TouchableOpacity](https://facebook.github.io/react-native/docs/touchableopacity)
- [ViewPagerAndroid](https://facebook.github.io/react-native/docs/viewpagerandroid)
- [VirtualizedList](https://facebook.github.io/react-native/docs/virtualizedlist)

### Properties

- [Layout Props](#layout-properties)
- [Shadow Props](#shadow-properties)
- [Transforms](#transform-properties)
- [`border-right-color`](#border-right-color)
- [`backface-visibility`](#backface-visibility)
- [`border-bottom-color`](#border-bottom-color)
- [`border-bottom-end-radius`](#border-bottom-end-radius)
- [`border-bottom-left-radius`](#border-bottom-left-radius)
- [`border-bottom-right-radius`](#border-bottom-right-radius)
- [`border-bottom-start-radius`](#border-bottom-start-radius)
- [`border-bottom-width`](#border-bottom-width)
- [`border-color`](#border-color)
- [`border-end-color`](#border-end-color)
- [`border-left-color`](#border-left-color)
- [`border-left-width`](#border-left-width)
- [`border-radius`](#border-radius)
- [`background-color`](#background-color)
- [`border-right-width`](#border-right-width)
- [`border-start-color`](#borderstartcolor)
- [`border-style`](#border-style)
- [`border-top-color`](#border-top-color)
- [`border-top-end-radius`](#border-top-end-radius)
- [`border-top-left-radius`](#border-top-left-radius)
- [`border-top-right-radius`](#border-top-right-radius)
- [`border-top-start-radius`](#border-top-start-radius)
- [`border-top-width`](#border-top-width)
- [`border-width`](#border-width)
- [`opacity`](#opacity)
- [`elevation`](#elevation)

### `border-right-color`
| Type               | Required |
| ------------------ | -------- |
| [color](colors.md) | No       |

---

### `backface-visibility`
| Type                      | Required |
| ------------------------- | -------- |
| enum('visible', 'hidden') | No       |

---

### `border-bottom-color`
| Type               | Required |
| ------------------ | -------- |
| [color](colors.md) | No       |

---

### `border-bottom-end-radius`
| Type   | Required |
| ------ | -------- |
| number | No       |

---

### `border-bottom-left-radius`
| Type   | Required |
| ------ | -------- |
| number | No       |

---

### `border-bottom-right-radius`
| Type   | Required |
| ------ | -------- |
| number | No       |

---

### `border-bottom-start-radius`
| Type   | Required |
| ------ | -------- |
| number | No       |

---

### `border-bottom-width`
| Type   | Required |
| ------ | -------- |
| number | No       |

---

### `border-color`
| Type               | Required |
| ------------------ | -------- |
| [color](colors.md) | No       |

---

### `border-end-color`
| Type               | Required |
| ------------------ | -------- |
| [color](colors.md) | No       |

---

### `border-left-color`
| Type               | Required |
| ------------------ | -------- |
| [color](colors.md) | No       |

---

### `border-left-width`
| Type   | Required |
| ------ | -------- |
| number | No       |

---

### `border-radius`
| Type   | Required |
| ------ | -------- |
| number | No       |

---

### `background-color`
| Type               | Required |
| ------------------ | -------- |
| [color](colors.md) | No       |

---

### `border-right-width`
| Type   | Required |
| ------ | -------- |
| number | No       |

---

### `border-start-color`
| Type               | Required |
| ------------------ | -------- |
| [color](colors.md) | No       |

---

### `border-style`
| Type                              | Required |
| --------------------------------- | -------- |
| enum('solid', 'dotted', 'dashed') | No       |

---

### `border-top-color`
| Type               | Required |
| ------------------ | -------- |
| [color](colors.md) | No       |

---

### `border-top-end-radius`
| Type   | Required |
| ------ | -------- |
| number | No       |

---

### `border-top-left-radius`
| Type   | Required |
| ------ | -------- |
| number | No       |

---

### `border-top-right-radius`
| Type   | Required |
| ------ | -------- |
| number | No       |

---

### `border-top-start-radius`
| Type   | Required |
| ------ | -------- |
| number | No       |

---

### `border-top-width`
| Type   | Required |
| ------ | -------- |
| number | No       |

---

### `border-width`
| Type   | Required |
| ------ | -------- |
| number | No       |

---

### `opacity`
| Type   | Required |
| ------ | -------- |
| number | No       |

---

### `elevation`
(Android-only) Sets the elevation of a view, using Android's underlying [elevation API](https://developer.android.com/training/material/shadows-clipping.html#Elevation). This adds a drop shadow to the item and affects z-order for overlapping views. Only supported on Android 5.0+, has no effect on earlier versions.

| Type   | Required | Platform |
| ------ | -------- | -------- |
| number | No       | Android  |


### Layout properties

- [`align-content`](#align-content)
- [`align-items`](#align-items)
- [`align-self`](#align-self)
- [`aspect-ratio`](#aspect-ratio)
- [`border-bottom-width`](#border-bottom-width)
- [`border-end-width`](#border-end-width)
- [`border-left-width`](#border-left-width)
- [`border-right-width`](#border-right-width)
- [`border-start-width`](#border-start-width)
- [`border-top-width`](#border-top-width)
- [`border-width`](#border-width)
- [`bottom`](#bottom)
- [`direction`](#direction)
- [`display`](#display)
- [`end`](#end)
- [`flex`](#flex)
- [`flex-basis`](#flex-basis)
- [`flex-direction`](#flex-direction)
- [`flex-grow`](#flex-grow)
- [`flex-shrink`](#flex-shrink)
- [`flex-wrap`](#flex-wrap)
- [`height`](#height)
- [`justify-content`](#justify-content)
- [`left`](#left)
- [`margin`](#margin)
- [`margin-bottom`](#margin-bottom)
- [`margin-end`](#margin-end)
- [`margin-horizontal`](#margin-horizontal)
- [`margin-left`](#margin-left)
- [`margin-right`](#margin-right)
- [`margin-start`](#margin-start)
- [`margin-top`](#margin-top)
- [`margin-vertical`](#margin-vertical)
- [`max-height`](#max-height)
- [`max-width`](#max-width)
- [`min-height`](#min-height)
- [`min-width`](#min-width)
- [`overflow`](#overflow)
- [`padding`](#padding)
- [`padding-bottom`](#padding-bottom)
- [`padding-end`](#padding-end)
- [`padding-horizontal`](#padding-horizontal)
- [`padding-left`](#padding-left)
- [`padding-right`](#padding-right)
- [`padding-start`](#padding-start)
- [`padding-top`](#padding-top)
- [`padding-vertical`](#padding-vertical)
- [`position`](#position)
- [`right`](#right)
- [`start`](#start)
- [`top`](#top)
- [`width`](#width)
- [`z-index`](#z-index)


### `align-content`

`align-content` controls how rows align in the cross direction, overriding the `align-content` of the parent. See https://developer.mozilla.org/en-US/docs/Web/CSS/align-content for more details.

| Type                                                                                 | Required |
| ------------------------------------------------------------------------------------ | -------- |
| enum('flex-start', 'flex-end', 'center', 'stretch', 'space-between', 'space-around') | No       |

---

### `align-items`

`align-items` aligns children in the cross direction. For example, if children are flowing vertically, `align-items` controls how they align horizontally. It works like `align-items` in CSS (default: stretch). See https://developer.mozilla.org/en-US/docs/Web/CSS/align-items for more details.

| Type                                                            | Required |
| --------------------------------------------------------------- | -------- |
| enum('flex-start', 'flex-end', 'center', 'stretch', 'baseline') | No       |

---

### `align-self`

`align-self` controls how a child aligns in the cross direction, overriding the `align-items` of the parent. It works like `align-self` in CSS (default: auto). See https://developer.mozilla.org/en-US/docs/Web/CSS/align-self for more details.

| Type                                                                    | Required |
| ----------------------------------------------------------------------- | -------- |
| enum('auto', 'flex-start', 'flex-end', 'center', 'stretch', 'baseline') | No       |

---

### `aspect-ratio`

Aspect ratio controls the size of the undefined dimension of a node. Aspect ratio is a non-standard property only available in React Native and not CSS.

* On a node with a set width/height aspect ratio controls the size of the unset dimension
* On a node with a set flex basis aspect ratio controls the size of the node in the cross axis if unset
* On a node with a measure function aspect ratio works as though the measure function measures the flex basis
* On a node with flex grow/shrink aspect ratio controls the size of the node in the cross axis if unset
* Aspect ratio takes min/max dimensions into account

| Type   | Required |
| ------ | -------- |
| number | No       |

---

### `border-bottom-width`

`border-bottom-width` works like `border-bottom-width` in CSS. See https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-width for more details.

| Type   | Required |
| ------ | -------- |
| number | No       |

---

### `border-end-width`

When direction is `ltr`, `border-end-width` is equivalent to `border-right-width`. When direction is `rtl`, `border-end-width` is equivalent to `border-left-width`.

| Type   | Required |
| ------ | -------- |
| number | No       |

---

### `border-left-width`

`border-left-width` works like `border-left-width` in CSS. See https://developer.mozilla.org/en-US/docs/Web/CSS/border-left-width for more details.

| Type   | Required |
| ------ | -------- |
| number | No       |

---

### `border-right-width`

`border-right-width` works like `border-right-width` in CSS. See https://developer.mozilla.org/en-US/docs/Web/CSS/border-right-width for more details.

| Type   | Required |
| ------ | -------- |
| number | No       |

---

### `border-start-width`

When direction is `ltr`, `border-start-width` is equivalent to `border-left-width`. When direction is `rtl`, `border-start-width` is equivalent to `border-right-width`.

| Type   | Required |
| ------ | -------- |
| number | No       |

---

### `border-top-width`

`border-top-width` works like `border-top-width` in CSS. See https://developer.mozilla.org/en-US/docs/Web/CSS/border-top-width for more details.

| Type   | Required |
| ------ | -------- |
| number | No       |

---

### `border-width`

`border-width` works like `border-width` in CSS. See https://developer.mozilla.org/en-US/docs/Web/CSS/border-width for more details.

| Type   | Required |
| ------ | -------- |
| number | No       |

---

### `bottom`

`bottom` is the number of logical pixels to offset the bottom edge of this component.

It works similarly to `bottom` in CSS, but in React Native you must use points or percentages. Ems and other units are not supported.

See https://developer.mozilla.org/en-US/docs/Web/CSS/bottom for more details of how `bottom` affects layout.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

---

### `direction`

`direction` specifies the directional flow of the user interface. The default is `inherit`, except for root node which will have value based on the current locale. See https://yogalayout.com/docs/layout-direction for more details.

| Type                          | Required | Platform |
| ----------------------------- | -------- | -------- |
| enum('inherit', 'ltr', 'rtl') | No       | iOS      |

---

### `display`

`display` sets the display type of this component.

It works similarly to `display` in CSS, but only support 'flex' and 'none'. 'flex' is the default.

| Type                 | Required |
| -------------------- | -------- |
| enum('none', 'flex') | No       |

---

### `end`

When the direction is `ltr`, `end` is equivalent to `right`. When the direction is `rtl`, `end` is equivalent to `left`.

This style takes precedence over the `left` and `right` styles.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

---

### `flex`

In React Native `flex` does not work the same way that it does in CSS. `flex` is a number rather than a string, and it works according to the `Yoga` library at https://github.com/facebook/yoga

When `flex` is a positive number, it makes the component flexible and it will be sized proportional to its flex value. So a component with `flex` set to 2 will take twice the space as a component with `flex` set to 1.

When `flex` is 0, the component is sized according to `width` and `height` and it is inflexible.

When `flex` is -1, the component is normally sized according `width` and `height`. However, if there's not enough space, the component will shrink to its `min-width` and `min-height`.

flex-grow, flex-shrink, and flex-basis work the same as in CSS.

| Type   | Required |
| ------ | -------- |
| number | No       |

---

### `flex-basis`

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

---

### `flex-direction`

`flex-direction` controls which directions children of a container go. `row` goes left to right, `column` goes top to bottom, and you may be able to guess what the other two do. It works like `flex-direction` in CSS, except the default is `column`. See https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction for more details.

| Type                                                   | Required |
| ------------------------------------------------------ | -------- |
| enum('row', 'row-reverse', 'column', 'column-reverse') | No       |

---

### `flex-grow`

| Type   | Required |
| ------ | -------- |
| number | No       |

---

### `flex-shrink`

| Type   | Required |
| ------ | -------- |
| number | No       |

---

### `flex-wrap`

`flex-wrap` controls whether children can wrap around after they hit the end of a flex container. It works like `flex-wrap` in CSS (default: nowrap). See https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap for more details. Note it does not work anymore with `align-items: stretch` (the default), so you may want to use `align-items: flex-start` for example (breaking change details: https://github.com/facebook/react-native/releases/tag/v0.28.0).

| Type                   | Required |
| ---------------------- | -------- |
| enum('wrap', 'nowrap') | No       |

---

### `height`

`height` sets the height of this component.

It works similarly to `height` in CSS, but in React Native you must use points or percentages. Ems and other units are not supported. See https://developer.mozilla.org/en-US/docs/Web/CSS/height for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

---

### `justify-content`

`justify-content` aligns children in the main direction. For example, if children are flowing vertically, `justify-content` controls how they align vertically. It works like `justify-content` in CSS (default: flex-start). See https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content for more details.

| Type                                                                                      | Required |
| ----------------------------------------------------------------------------------------- | -------- |
| enum('flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly') | No       |

---

### `left`

`left` is the number of logical pixels to offset the left edge of this component.

It works similarly to `left` in CSS, but in React Native you must use points or percentages. Ems and other units are not supported.

See https://developer.mozilla.org/en-US/docs/Web/CSS/left for more details of how `left` affects layout.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

---

### `margin`

Setting `margin` has the same effect as setting each of `margin-top`, `margin-left`, `margin-bottom`, and `margin-right`. See https://developer.mozilla.org/en-US/docs/Web/CSS/margin for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

---

### `margin-bottom`

`margin-bottom` works like `margin-bottom` in CSS. See https://developer.mozilla.org/en-US/docs/Web/CSS/margin-bottom for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

---

### `margin-end`

When direction is `ltr`, `margin-end` is equivalent to `margin-right`. When direction is `rtl`, `margin-end` is equivalent to `margin-left`.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

---

### `margin-horizontal`

Setting `margin-horizontal` has the same effect as setting both `margin-left` and `margin-right`.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

---

### `margin-left`

`margin-left` works like `margin-left` in CSS. See https://developer.mozilla.org/en-US/docs/Web/CSS/margin-left for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

---

### `margin-right`

`margin-right` works like `margin-right` in CSS. See https://developer.mozilla.org/en-US/docs/Web/CSS/margin-right for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

---

### `margin-start`

When direction is `ltr`, `margin-start` is equivalent to `margin-left`. When direction is `rtl`, `margin-start` is equivalent to `margin-right`.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

---

### `margin-top`

`margin-top` works like `margin-top` in CSS. See https://developer.mozilla.org/en-US/docs/Web/CSS/margin-top for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

---

### `margin-vertical`

Setting `margin-vertical` has the same effect as setting both `margin-top` and `margin-bottom`.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

---

### `max-height`

`max-height` is the maximum height for this component, in logical pixels.

It works similarly to `max-height` in CSS, but in React Native you must use points or percentages. Ems and other units are not supported.

See https://developer.mozilla.org/en-US/docs/Web/CSS/max-height for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

---

### `max-width`

`max-width` is the maximum width for this component, in logical pixels.

It works similarly to `max-width` in CSS, but in React Native you must use points or percentages. Ems and other units are not supported.

See https://developer.mozilla.org/en-US/docs/Web/CSS/max-width for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

---

### `min-height`

`min-height` is the minimum height for this component, in logical pixels.

It works similarly to `min-height` in CSS, but in React Native you must use points or percentages. Ems and other units are not supported.

See https://developer.mozilla.org/en-US/docs/Web/CSS/min-height for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

---

### `min-width`

`min-width` is the minimum width for this component, in logical pixels.

It works similarly to `min-width` in CSS, but in React Native you must use points or percentages. Ems and other units are not supported.

See https://developer.mozilla.org/en-US/docs/Web/CSS/min-width for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

---

### `overflow`

`overflow` controls how children are measured and displayed. `overflow: hidden` causes views to be clipped while `overflow: scroll` causes views to be measured independently of their parents main axis. It works like `overflow` in CSS (default: visible). See https://developer.mozilla.org/en/docs/Web/CSS/overflow for more details. `overflow: visible` only works on iOS. On Android, all views will clip their children.

| Type                                | Required |
| ----------------------------------- | -------- |
| enum('visible', 'hidden', 'scroll') | No       |

---

### `padding`

Setting `padding` has the same effect as setting each of `padding-top`, `padding-bottom`, `padding-left`, and `padding-right`. See https://developer.mozilla.org/en-US/docs/Web/CSS/padding for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

---

### `padding-bottom`

`padding-bottom` works like `padding-bottom` in CSS. See https://developer.mozilla.org/en-US/docs/Web/CSS/padding-bottom for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

---

### `padding-end`

When direction is `ltr`, `padding-end` is equivalent to `padding-right`. When direction is `rtl`, `padding-end` is equivalent to `padding-left`.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

---

### `padding-horizontal`

Setting `padding-horizontal` is like setting both of `padding-left` and `padding-right`.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

---

### `padding-left`

`padding-left` works like `padding-left` in CSS. See https://developer.mozilla.org/en-US/docs/Web/CSS/padding-left for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

---

### `padding-right`

`padding-right` works like `padding-right` in CSS. See https://developer.mozilla.org/en-US/docs/Web/CSS/padding-right for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

---

### `padding-start`

When direction is `ltr`, `padding-start` is equivalent to `padding-left`. When direction is `rtl`, `padding-start` is equivalent to `padding-right`.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

---

### `padding-top`

`padding-top` works like `padding-top` in CSS. See https://developer.mozilla.org/en-US/docs/Web/CSS/padding-top for more details.

| Type            | Required |
| --------------- | -------- |
| number, ,string | No       |

---

### `padding-vertical`

Setting `padding-vertical` is like setting both of `padding-top` and `padding-bottom`.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

---

### `position`

`position` in React Native is similar to regular CSS, but everything is set to `relative` by default, so `absolute` positioning is always just relative to the parent.

If you want to position a child using specific numbers of logical pixels relative to its parent, set the child to have `absolute` position.

If you want to position a child relative to something that is not its parent, just don't use styles for that. Use the component tree.

See https://github.com/facebook/yoga for more details on how `position` differs between React Native and CSS.

| Type                         | Required |
| ---------------------------- | -------- |
| enum('absolute', 'relative') | No       |

---

### `right`

`right` is the number of logical pixels to offset the right edge of this component.

It works similarly to `right` in CSS, but in React Native you must use points or percentages. Ems and other units are not supported.

See https://developer.mozilla.org/en-US/docs/Web/CSS/right for more details of how `right` affects layout.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

---

### `start`

When the direction is `ltr`, `start` is equivalent to `left`. When the direction is `rtl`, `start` is equivalent to `right`.

This style takes precedence over the `left`, `right`, and `end` styles.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

---

### `top`

`top` is the number of logical pixels to offset the top edge of this component.

It works similarly to `top` in CSS, but in React Native you must use points or percentages. Ems and other units are not supported.

See https://developer.mozilla.org/en-US/docs/Web/CSS/top for more details of how `top` affects layout.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

---

### `width`

`width` sets the width of this component.

It works similarly to `width` in CSS, but in React Native you must use points or percentages. Ems and other units are not supported. See https://developer.mozilla.org/en-US/docs/Web/CSS/width for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

---

### `z-index`

`z-index` controls which components display on top of others. Normally, you don't use `z-index`. Components render according to their order in the document tree, so later components draw over earlier ones. `z-index` may be useful if you have animations or custom modal interfaces where you don't want this behavior.

It works like the CSS `z-index` property - components with a larger `z-index` will render on top. Think of the z-direction like it's pointing from the phone into your eyeball. See https://developer.mozilla.org/en-US/docs/Web/CSS/z-index for more details.

On iOS, `z-index` may require `View`s to be siblings of each other for it to work as expected.

| Type   | Required |
| ------ | -------- |
| number | No       |

### Shadow properties

- [`shadow-color`](#shadow-color)
- [`shadow-offset`](#shadow-offset)
- [`shadow-opacity`](#shadow-opacity)
- [`shadow-radius`](#shadow-radius)

### `shadow-color`

Sets the drop shadow color

| Type               | Required | Platform |
| ------------------ | -------- | -------- |
| [color](colors.md) | No       | iOS      |

---

### `shadow-offset`

Sets the drop shadow offset

| Type                                   | Required | Platform |
| -------------------------------------- | -------- | -------- |
| object: {width: number,height: number} | No       | iOS      |

---

### `shadow-opacity`

Sets the drop shadow opacity (multiplied by the color's alpha component)

| Type   | Required | Platform |
| ------ | -------- | -------- |
| number | No       | iOS      |

---

### `shadow-radius`

Sets the drop shadow blur radius

| Type   | Required | Platform |
| ------ | -------- | -------- |
| number | No       | iOS      |

### Transform properties

- [`decomposed-matrix`](#decomposed-matrix)
- [`rotation`](#rotation)
- [`scale-x`](#scale-x)
- [`scale-y`](#scale-y)
- [`transform`](#transform)
- [`transform-matrix`](#transform-matrix)
- [`translate-x`](#translate-x)
- [`translate-y`](#translate-y)

### `decomposed-matrix`

Deprecated. Use the transform prop instead.

| Type                     | Required |
| ------------------------ | -------- |
| decomposed-matrixPropType | No       |

---

### `rotation`

| Type                                                                         | Required |
| ---------------------------------------------------------------------------- | -------- |
| deprecatedPropType(ReactPropTypes.number, 'Use the transform prop instead.') | No       |

---

### `scale-x`

| Type                                                                         | Required |
| ---------------------------------------------------------------------------- | -------- |
| deprecatedPropType(ReactPropTypes.number, 'Use the transform prop instead.') | No       |

---

### `scale-y`

| Type                                                                         | Required |
| ---------------------------------------------------------------------------- | -------- |
| deprecatedPropType(ReactPropTypes.number, 'Use the transform prop instead.') | No       |

---

### `transform`

`transform` accepts an array of transformation objects. Each object specifies the property that will be transformed as the key, and the value to use in the transformation. Objects should not be combined. Use a single key/value pair per object.

The rotate transformations require a string so that the transform may be expressed in degrees (deg) or radians (rad). For example:

`transform([{ rotateX: '45deg' }, { rotateZ: '0.785398rad' }])`

The skew transformations require a string so that the transform may be expressed in degrees (deg). For example:

`transform([{ skewX: '45deg' }])`

| Type                                                                                                                                                                                                                                                                                                                                                    | Required |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| array of object: {perspective: number}, ,object: {rotate: string}, ,object: {rotateX: string}, ,object: {rotateY: string}, ,object: {rotateZ: string}, ,object: {scale: number}, ,object: {scale-x: number}, ,object: {scale-y: number}, ,object: {translate-x: number}, ,object: {translate-y: number}, ,object: {skewX: string}, ,object: {skewY: string} | No       |

---

### `transform-matrix`

Deprecated. Use the transform prop instead.

| Type                    | Required |
| ----------------------- | -------- |
| transform-matrixPropType | No       |

---

### `translate-x`

| Type                                                                         | Required |
| ---------------------------------------------------------------------------- | -------- |
| deprecatedPropType(ReactPropTypes.number, 'Use the transform prop instead.') | No       |

---

### `translate-y`

| Type                                                                         | Required |
| ---------------------------------------------------------------------------- | -------- |
| deprecatedPropType(ReactPropTypes.number, 'Use the transform prop instead.') | No       |



## Image style props

These style props work with the [Image component](https://facebook.github.io/react-native/docs/image) and are applicable to these components as well:

- [ImageBackground](https://facebook.github.io/react-native/docs/imagebackground) using `imageStyle` prop

### Properties

- [`border-top-right-radius`](#border-top-right-radius)
- [`backface-visibility`](#backface-visibility)
- [`border-bottom-left-radius`](#border-bottom-left-radius)
- [`border-bottom-right-radius`](#border-bottom-right-radius)
- [`border-color`](#border-color)
- [`border-radius`](#border-radius)
- [`border-top-left-radius`](#border-top-left-radius)
- [`background-color`](#background-color)
- [`border-width`](#border-width)
- [`opacity`](#opacity)
- [`overflow`](#overflow)
- [`resize-mode`](#resize-mode)
- [`tint-color`](#tint-color)
- [`overlay-color`](#overlay-color)

#### `border-top-right-radius`
| Type   | Required |
| ------ | -------- |
| number | No       |

---


#### `backface-visibility`
| Type                      | Required |
| ------------------------- | -------- |
| enum('visible', 'hidden') | No       |

---


#### `border-bottom-left-radius`
| Type   | Required |
| ------ | -------- |
| number | No       |

---


#### `border-bottom-right-radius`
| Type   | Required |
| ------ | -------- |
| number | No       |

---


#### `border-color`
| Type               | Required |
| ------------------ | -------- |
| [color](colors.md) | No       |

---


#### `border-radius`
| Type   | Required |
| ------ | -------- |
| number | No       |

---


#### `border-top-left-radius`
| Type   | Required |
| ------ | -------- |
| number | No       |

---


#### `background-color`
| Type               | Required |
| ------------------ | -------- |
| [color](colors.md) | No       |

---


#### `border-width`
| Type   | Required |
| ------ | -------- |
| number | No       |


---

#### `opacity`
| Type   | Required |
| ------ | -------- |
| number | No       |

---


#### `overflow`
| Type                      | Required |
| ------------------------- | -------- |
| enum('visible', 'hidden') | No       |

---

#### `resize-mode`
| Type                                                    | Required |
| ------------------------------------------------------- | -------- |
| enum('cover', 'contain', 'stretch', 'repeat', 'center') | No       |

---


#### `tint-color`
Changes the color of all the non-transparent pixels to the tintColor.

| Type               | Required |
| ------------------ | -------- |
| [color](colors.md) | No       |

---

#### `overlay-color`
When the image has rounded corners, specifying an overlayColor will cause the remaining space in the corners to be filled with a solid color. This is useful in cases which are not supported by the Android implementation of rounded corners:

* Certain resize modes, such as 'contain'
* Animated GIFs

A typical way to use this prop is with images displayed on a solid background and setting the `overlayColor` to the same color as the background.

For details of how this works under the hood, see https://frescolib.org/docs/rounded-corners-and-circles.html

| Type   | Required | Platform |
| ------ | -------- | -------- |
| string | No       | Android  |
