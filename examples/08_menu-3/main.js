var options = {
  globalClose: true,
  triggerSelector: "> .js-contentToggle__trigger",
  contentSelector: "> .js-contentToggle__content",
  toggleProperties: [ "width", "opacity" ],
  toggleOptions: {
    duration: 400
  }
};

$( ".js-contentToggle--level2" ).contentToggle( options );
$( ".js-contentToggle--level1" ).contentToggle( options );
