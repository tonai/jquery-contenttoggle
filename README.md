# jquery-contenttoggle v0.0.1

A jQuery plugin for managing various form of content toggling.

Usage examples :
* Menu
* Tabs
* FAQ
* ...


## Installation

You can get it with [Bower](http://bower.io/search/?q=jquery-contenttoggle) :
```shell
bower install --save-dev jquery-contenttoggle
```

Then include the script in your HTML (after jQuery) :
```html
<script src="/path/to/jquery.contenttoggle.js"></script>
```


## Usage

### General informations

Create new instances based on a DOM selector :
```javascript
$('.js-contentToggle').contentToggle();
```

The selector used above is important, because it will create some kind of a group, and each elements inside this group will be bound together.

There can only be one opened element at the same time inside a group.

When an element will be opened, all other elements will close.

By default the associated contents of an element, that will be toggled, are all elements with the class `js-contentToggle__content` inside the main element.

Example :
```html
<div class="js-contentToggle">
  <div>
    <a href="#">Toggle !</a>
    <div class="js-contentToggle__content">
      <p>Lorem ipsum dolor sit amet.</p>
    </div>
  </div>
</div>
```

All clicks inside `js-contentToggle` will toggle the content, but all clicks inside `js-contentToggle__content` won't propagate through the DOM.

If you have to specify which links will trigger the toggle action you can use the `js-contentToggle__trigger` class on them (by default).

Example :
```html
<div class="js-contentToggle">
  <div>
    <a href="#" class="js-contentToggle__trigger">Toggle !</a> - <a href="#">Don't toggle !</a>
    <div class="js-contentToggle__content">
      <p>Lorem ipsum dolor sit amet.</p>
    </div>
  </div>
</div>
```

### Using `group options`

You can also pass options when instantiating the elements. options are described in the section below :
```javascript
$('.js-contentToggle').contentToggle(options);
```

Those options will be initialized to all matching elements.

We will name this way of passing options as `group options`.

### Using `data options`

But you can also override specific options by using HTML data on specific elements.

We will name this way of passing options as `data options`.

If the option you want to override is `defaultState` you will need to add a data attribute to the element named `data-default-state`.

Example :
```html
<div class="js-contentToggle" data-default-state="open"></div>
```

Those options should be set on the element matching the selector you will use when instantiating the plugin.

### With dynamic content

If you need to dynamically add other elements (using AJAX for example) to an existing group.

You will need to use the same selector when instantiating the plugin like `$('.js-contentToggle').contentToggle(options);`.

It is not a problem if some elements have already been initialized, elements are protected against multiple instantiation.


## Configuration

### independent & data-independent

Type: `boolean`  
Default: `false`

If elements inside a group are independent, it breaks the rule of having only one visible content at the same time for a group.

This is useful for a Frequently Asked Questions list for example.

### defaultState & data-default-state

Type: `string`  
Default: `null`

Use this option if you want to enforce the default state of an element (`open` or `close`).

By default the default state of the plugin will be initialized using jQuery `is(':visible')` test on the first associated content.

For example this can be use for accessibility compatibility by having the content shown in the HTML document and by hiding it with JavaScript.

The `open` option defined as `group option` will not break the rule of one visible content at the same time, unless elements are independent.

If your elements are not independent, use one `data option` on the element you want to be opened by default.

### globalClose & data-global-close

Type: `boolean`  
Default: `false`

When setting this option to `true` a `click` event listener will be added to the `document` with the associated action of closing all elements.

Remember that all clicks inside the contents won't propagate through the DOM (same for triggers).

This is useful for a mobile compatible menu for example.

### beforeCallback & data-before-callback

Type: `function` or `string`  
Default: `null`

A function to be called before an action (`toggle`, `open` or `close`).

Return `true` or `false` inside this callback to prevent or not the action.

Use `this` inside the callback to refer to the plugin instance.

If you use a `string` instead of a `function`, the plugin will search for a `function` with the given name. This function must be accessible on the global scope.

### triggerSelector & data-trigger-selector

Type: `string`  
Default: `.js-contentToggle__trigger`

The selector of the triggers.

### triggerSelectorContext & data-trigger-selector-context

Type: `boolean`  
Default: `true`

If `true` the main element will be used as context for the query selector like this :
```javascript
this.$triggers = $(this.options.triggerSelector, this.$element);
```

Set it to `false` if you want to use triggers outside of the main element.

### contentSelector & data-content-selector

Type: `string`  
Default: `.js-contentToggle__content`

The selector of the contents.

### contentSelectorContext & data-content-selector-context

Type: `boolean`  
Default: `true`

If `true` the main element will be used as context for the query selector like this :
```javascript
this.$contents = $(this.options.contentSelector, this.$element);
```

Set it to `false` if you want to use contents outside of the main element.

### elementClass & data-element-class

Type: `string`  
Default: `is-open`

A class that will be added to the main element when its state is open.

### triggerClass & data-trigger-class

Type: `string`  
Default: `is-active`

A class that will be added to the active trigger.

### toggleProperties & data-toggle-properties

Type: `object` or `string`  
Default: `{height: 'toggle'}`

The properties object to use as first argument to the jQuery `animate` function.

Available properties : `height`, `width` and `opacity` with the `toggle` value.
More informations [here](http://api.jquery.com/animate/).

If you use a `string` instead of an `object`, the plugin will consider your are passing a serialized JSON.

### toggleOptions & data-toggle-options

Type: `object` or `string`  
Default: `{duration: 0}`

The options object to use as second argument to the jQuery `animate` function.

More informations on available options [here](http://api.jquery.com/animate/).

If you use a `string` instead of an `object`, the plugin will consider your are passing a serialized JSON.


## Custom events

you can trigger custom events to control the plugin instances with JavaScript.

For example opening the first element :
```javascript
$('.js-contentToggle').eq(0).trigger('open');
```

Available events : 
* `open` : open an element
* `close` : close an element
* `toggle` : toggle the state of an element
* `destroy` : destroy the plugin instance

## Examples

Examples are available [here](http://tonai.github.io/jquery-contenttoggle/).
