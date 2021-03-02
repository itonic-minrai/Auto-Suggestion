export default class AutoSuggestionEvent {

  constructor(){
    this.listenDocumentClick();
    this.handleDoubleClick();
  };


  /**
   * Listen event click on dom
   */
  listenDocumentClick() {
    $(document).on('click', e => {
      if (!$(e.target).hasClass(this.activeClass)) {
        this.$listWrapper.empty();
        this.isListOpen = false;
      };
    });
  };

  /**
   * Bind Double click event on Selector (Input Field)
   */
  handleDoubleClick() {
    const { doubleClick = true } = this.config;
    this.$selector.dblclick(e => this.appendAutoSuggestion(e.target));
  };

}