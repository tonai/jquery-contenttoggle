$( ".js-contentToggle" ).contentToggle( {
  globalClose: true,
  beforeCallback: function() {
    "use strict";

    // Prevent opening the menu if it is already visible with CSS.
    return this.isOpen || !this.$contents.is( ":visible" );
  },
  toggleOptions: {
    duration: 0,
    complete: function() {
      "use strict";

      // Remove the "display:none" style added by jQuery when closing the menu.
      var $this = $( this );
      var isOpen = $this.triggerHandler( "isOpen" );
      if ( !isOpen ) {
        $this.css( { display: "" } );
      }
    }
  }
} );
