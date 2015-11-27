var $elements = $( ".js-contentToggle" ).contentToggle( {
  independent: true,
  contentSelector: "+ .js-contentToggle__content"
} );

// Open the tab when clicking on the summary item.
$( ".js-summary" ).on( "click", function() {
  "use strict";
  var href = $( this ).attr( "href" );
  $( href ).trigger( "open" );
} );

// Manage open and close buttons.
$( ".js-button--open" ).on( "click", function() {
  "use strict";
  $elements.trigger( "open" );
} );
$( ".js-button--close" ).on( "click", function() {
  "use strict";
  $elements.trigger( "close" );
} );
