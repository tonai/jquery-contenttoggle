/********** Menu initialization **********/
$('.js-contentToggle--menu').contentToggle({
  globalClose: true,
  beforeCallback: function() {
    // Prevent opening the menu if it is already visible with CSS.
    return this.isOpen || !this.$contents.is(':visible');
  },
  toggleOptions: {
    duration: 0,
    complete: function() {
      // Remove the "display:none" inline style added by jQuery.
      var $this = $(this);
      if (!$this.is(':visible')) {
        $this.css({display: ''});
      }
    }
  }
});
