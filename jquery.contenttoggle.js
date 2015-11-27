( function( $ ) {
  "use strict";

  /* Plugin constants. */
  var TRIGGER_KEY_CODES = [ 13 /*enter*/, 32 /*space*/ ];
  var AVAILABLE_ROLE_BUTTON_TAGS = [ "a", "div", "figure", "p", "pre",
                                    "blockquote", "img", "ins", "del",
                                    "output", "span", "summary" ];

  /* Plugin variables. */
  var pluginName  = "contentToggle";
  var instances = {};
  var defaultOptions = {};
  var $global = $( document );
  var isIthing = navigator.userAgent.match( /iPad|iPhone/i );
  var sanitize = /[^a-z0-9_-]/gi;
  var uid = 0;

  /* Plugin default options. */
  defaultOptions = {
    defaultState: null,
    globalClose: false,
    independent: false,
    noSelfClosing: false,
    beforeCallback: null,
    triggerSelector: ".js-contentToggle__trigger",
    triggerSelectorContext: true,
    labelSelector: null,
    labelSelectorContext: true,
    contentSelector: ".js-contentToggle__content",
    contentSelectorContext: true,
    elementClass: "is-open",
    triggerClass: "is-active",
    openedLabel: null,
    closedLabel: null,
    toggleProperties: [ "height" ],
    toggleOptions: {
      duration: 0
    }
  };

  /**
   * Plugin Constructor.
   *
   * @param {Node|jQuery} element
   *   Main DOM element.
   * @param {string} selector
   *   Element initial selector.
   * @param {object} options
   *   Instance specific options.
   */
  function Plugin( element, selector, options ) {
    var data;

    // Merge specific and default options.
    this.options = {
      group: selector
    };
    $.extend( this.options, defaultOptions, options );

    // Initialize data.
    this.$element = ( element instanceof $ ) ? element : $( element );
    this.uid = ++uid;

    // Data initialization.
    this.setup();

    // Empty object initialization.
    data = this.$element.data( pluginName );
    if ( !instances[ this.options.group ] ) {
      instances[ this.options.group ] = {};
    }
    if ( !data ) {
      data = {};
    }

    // Check if instance has not been already initialized.
    if ( !data[ this.options.group ] ) {

      // Save the new instance.
      instances[ this.options.group ][ this.uid ] = this;
      data[ this.options.group ] = this;
      this.$element.data( pluginName, data );

      // Plugin initialization.
      this.bind();
      this.init();
    }
  }

  /**
   * Setup plugin.
   * e.g. Get DOM elements, setup data...
   */
  Plugin.prototype.setup = function() {
    this.setupDataOptions();

    // Sanitize group name.
    if ( this.options.group ) {
      this.options.group = this.options.group.toString().replace( sanitize, "" );
    }

    // Parse JSON options.
    if ( typeof this.options.toggleProperties === "string" ) {
      this.options.toggleProperties = JSON.parse( this.options.toggleProperties );
    }
    if ( typeof this.options.toggleOptions === "string" ) {
      this.options.toggleOptions = JSON.parse( this.options.toggleOptions );
    }

    // Get trigger elements.
    if ( this.options.triggerSelectorContext ) {
      this.$triggers = $( this.options.triggerSelector, this.$element );
    } else {
      this.$triggers = $( this.options.triggerSelector );
    }
    if ( this.$triggers.length === 0 ) {
      this.$triggers = this.$element;
    }

    // Get labels elements.
    if ( this.options.labelSelector ) {
      if ( this.options.labelSelectorContext ) {
        this.$labels = $( this.options.labelSelector, this.$element );
      } else {
        this.$labels = $( this.options.labelSelector );
      }
    } else {
      this.$labels = this.$triggers;
    }

    // Get content elements.
    if ( this.options.contentSelectorContext ) {
      this.$contents = $( this.options.contentSelector, this.$element );
    } else {
      this.$contents = $( this.options.contentSelector );
    }

    // Get callback.
    if ( typeof this.options.beforeCallback === "string" &&
        window[this.options.beforeCallback] &&
        typeof window[ this.options.beforeCallback ] === "function" ) {
      this.options.beforeCallback = window[ this.options.beforeCallback ].bind( this );
    } else if ( typeof this.options.beforeCallback === "function" ) {
      this.options.beforeCallback = this.options.beforeCallback.bind( this );
    }
  };

  /**
   * Setup plugin specific data.
   * e.g. Get DOM elements, setup data...
   */
  Plugin.prototype.setupDataOptions = function() {
    $.each(
      this.$element.data(),
      function( index, value ) {
        if ( index in defaultOptions ) {
          this.options[ index ] = value;
        }
      }.bind( this )
    );
  };

  /**
   * Bind events.
   */
  Plugin.prototype.bind = function() {
    var namespaces = "." + pluginName + "." + this.options.group;
    var eventName = ( isIthing && this.options.globalClose ) ? "touchstart" : "click";
    var $all = this.$element.add( this.$triggers ).add( this.$contents );

    // Bind custom events on all elements.
    $all.on( "destroy" + namespaces, this.destroy.bind( this ) );
    $all.on( "toggle" + namespaces, $.proxy( this.toggle, this, null ) );
    $all.on( "close" + namespaces, $.proxy( this.toggle, this, false ) );
    $all.on( "open" + namespaces, $.proxy( this.toggle, this, true ) );
    $all.on( "isOpen" + namespaces, function() {
      return this.isOpen;
    }.bind( this ) );

    // Bind native events on triggers.
    this.$triggers.on( eventName + namespaces, function( event ) {
      event.preventDefault();
      if ( !event.originalEvent.mozInputSource ||
          event.originalEvent.mozInputSource !== MouseEvent.MOZ_SOURCE_KEYBOARD ) {
        this.toggle( null, event );
      }
    }.bind( this ) );
    this.$triggers.on( "keydown" + namespaces, function( event ) {
      if ( $.inArray( event.keyCode, TRIGGER_KEY_CODES ) !== -1 ) {
        event.preventDefault();
        this.toggle( null, event );
      }
    }.bind( this ) );

    // Bind native events on contents (avoid triggers click event).
    this.$contents.on( eventName + namespaces, function( event ) {
      event.stopPropagation();
    } );
  };

  /**
   * Initialize default plugin state.
   */
  Plugin.prototype.init = function() {

    // Initialize triggers IDs.
    this.tid = [];
    this.$triggers.each( $.proxy( this.initId, this, this.tid, "contentToggle__trigger" ) );

    // Initialize contents IDs.
    this.cid = [];
    this.$contents.each( $.proxy( this.initId, this, this.cid, "contentToggle__content" ) );

    // Initialize triggers attributes.
    this.$triggers.each( function( index, element ) {
      var $trigger = this.$triggers.eq( index );
      if ( !$trigger.attr( "role" ) &&
          $.inArray( element.tagName.toLowerCase(), AVAILABLE_ROLE_BUTTON_TAGS ) !== -1 ) {
        $trigger.attr( "role", "button" );
      }
      if ( !$trigger.attr( "tabindex" ) ) {
        $trigger.attr( "tabindex", "0" );
      }
    }.bind( this ) );
    this.$triggers.attr( "aria-controls", this.cid.join( " " ) );

    // Default plugin state.
    if ( $.inArray( this.options.defaultState, [ "open", "close" ] ) !== -1 ) {
      this.$element.trigger( this.options.defaultState + "." + pluginName );
    } else {
      this.isOpen = this.$contents.is( ":visible" );
      this.update();
    }
  };

  /**
   * Initialize element id.
   */
  Plugin.prototype.initId = function( ids, prefix, index, element ) {
    var $element = $( element );
    ids[ index ] = $element.attr( "id" );
    if ( !ids[ index ] ) {
      ids[ index ] = prefix + "-" + this.uid + "-" + index;
      $element.attr( "id", ids[index] );
    }
  };

  /**
   * Toggle content.
   *
   * @param {boolean} state
   *   The state of the wanted display.
   * @param {Event} event
   *   The event object.
   */
  Plugin.prototype.toggle = function( state, event ) {
    event.stopPropagation();

    if ( typeof state !== "boolean" ) {
      state = !this.isOpen;
    }

    this.$currentTrigger = null;
    if ( this.$triggers.is( event.currentTarget ) ) {
      this.$currentTrigger = $( event.currentTarget );
    }

    if ( !this.options.beforeCallback ||
        ( typeof this.options.beforeCallback === "function" &&
         this.options.beforeCallback( event ) ) ) {
      if ( state ) {
        this.open();
      } else if ( !this.options.noSelfClosing ) {
        this.close();
      }
    }
  };

  /**
   * Open content.
   */
  Plugin.prototype.open = function() {
    var eventName;
    if ( this.isOpen !== true ) {
      this.isOpen = true;
      this.do();
      this.closeAll( true );
      if ( this.options.globalClose ) {
        eventName = isIthing ? "touchstart" : "click";
        $global.on( eventName + "." + pluginName + this.uid, function() {
          this.closeAll();
        }.bind( this ) );
      }
    }
  };

  /**
   * Close content.
   */
  Plugin.prototype.close = function() {
    if ( this.isOpen !== false ) {
      this.isOpen = false;
      this.do();
      $global.off( "." + pluginName + this.uid );
    }
  };

  /**
   * Close all binded instances.
   *
   * @param {boolean} butItself
   *   Close all but itself or not.
   */
  Plugin.prototype.closeAll = function( butItself ) {
    if ( !this.options.independent ) {
      $.each( instances[ this.options.group ], function( uid, instance ) {
        if ( Number( uid ) !== this.uid ) {
          instance.close();
        }
      }.bind( this ) );
    }
    if ( !butItself ) {
      this.close();
    }
  };

  /**
   * Perform toggle action.
   */
  Plugin.prototype.do = function() {
    var toggleProperties = {};
    var action = this.isOpen ? "show" : "hide";

    this.update();

    $.each(
      this.options.toggleProperties,
      function( index, value ) {
        toggleProperties[ value ] = action;
      }
    );

    this.$contents.stop().animate(
      toggleProperties,
      this.options.toggleOptions
    );
  };

  /**
   * Update classes and aria data.
   */
  Plugin.prototype.update = function() {
    if ( this.isOpen ) {
      this.$element.addClass( this.options.elementClass );
      this.$contents.attr( "aria-hidden", false );
      this.$triggers.attr( "aria-expanded", true );
      if ( this.$currentTrigger ) {
        this.$currentTrigger.addClass( this.options.triggerClass );
      } else {
        this.$triggers.addClass( this.options.triggerClass );
      }
      if ( typeof this.options.openedLabel === "string" ) {
        this.$labels.html( this.options.openedLabel );
      }
    } else {
      this.$element.removeClass( this.options.elementClass );
      this.$contents.attr( "aria-hidden", true );
      this.$triggers.attr( "aria-expanded", false );
      this.$triggers.removeClass( this.options.triggerClass );
      if ( typeof this.options.closedLabel === "string" ) {
        this.$labels.html( this.options.closedLabel );
      }
    }
  };

  /**
   * Destroy events.
   */
  Plugin.prototype.destroy = function() {
    this.$element.removeData( pluginName );
    this.$element.off( "." + pluginName );
    this.$triggers.off( "." + pluginName );
    this.$contents.off( "." + pluginName );
    $global.off( "." + pluginName + this.uid );
  };

  /* Expose jQuery plugin. */
  $.fn[ pluginName ] = function( options ) {
    var selector = this.selector;
    return this.each( function() {
      new Plugin( this, selector, options );
    } );
  };
} )( jQuery );
