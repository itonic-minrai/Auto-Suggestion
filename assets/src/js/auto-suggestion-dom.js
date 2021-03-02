import $ from 'jquery';
import AutoSuggestionEvent from './auto-suggestion-events';
import { ICONS, PREFIX, CLASS_NAME } from './constants';

export default class AutoSuggestionDOM {

  $chipWrapper = null;
  $autoSuggestionList = null;

 /*  constructor(){
    super();
  }; */

/**
 * Generate suggestion list
 */
  getTemplate(val) {
    const { usersList } = this;

    const unSelectedIds = this.unSelectedIds(usersList);


    /* Clear list */
    if (!unSelectedIds.length) {
      this.appendNoDataTemplate();
      return false;
    };


    /* For Each */
    const list = this.getSuggestionList(unSelectedIds, val);

    this.isListOpen = true;

    if (unSelectedIds.length) {
      const { id } = unSelectedIds[0];
      this.removeActive();
      this.addActive(id);
    };

    return list;
  };



  getList(userObj, val) {
    const { id, title } = userObj;
    const regex = new RegExp(val, 'gi');
    const textWidthHighlight = val ? title.replace(regex, `<strong>${val}</strong>`) : title;

    const userTemplate = this.getUserTemplate({ ...userObj, title: textWidthHighlight });

    const $a = $(`<div data-index="${id}" />`);
    $a.append(userTemplate); //.append(unmatchedText);
    this.$userListDom[id] = $a;
    this.bindEventOnList($a, id);
    return $a;
  };


  getUserTemplate(userObj) {
    const { defaultImg, userIcon } = this.config;
    const { title = '', user_type = '' } = userObj;

    const imgUlr = userObj.img_url && userObj.img_url.length ? userObj.img_url : defaultImg;
    const $fragment = $(document.createDocumentFragment());
    const img = $(`<div class="${PREFIX}-autocomplet-img" style="background-image: url('${imgUlr}')" />`);
    const group = $(`<span class="${PREFIX}-autocomplete-group" />`).text(user_type).append(userIcon);
    const name = $(`<span class="${PREFIX}-autocomplete-name"/>`).append(title);
    const wrapperDiv = $(`<div />`).append(name).append(group);
    return $fragment.append(img).append(wrapperDiv);
  };


  /**
   * Append the no data template on list
   */
  appendNoDataTemplate() {
    const { noDataText } = this.config;
    const $p = $(`<p>`).append(noDataText);
    this.$autoSuggestionList.empty().append($p);
  };


  /**
   * Generate user chip template
   */
  getUserChip(id) {
    const selecteduser = this.usersList[id];
    const userTemplate = this.getUserTemplate(selecteduser);

    const $chip = $(`<a href="#"/>`);
    const $closeSpan = $(`<span class="${PREFIX}-autocomplete-user-chip-remove"/>`);
    $closeSpan.append(ICONS.close);
    $closeSpan.on('click', e => this.handleRemoveChip(e, id));
    const $wrapper = $(`<div />`).append(userTemplate).append($closeSpan);
    return $chip.append($wrapper);
  };


  constructDom(){
    let $autoSuggestionWrapper, 
        $listWithInput,
        $userChips,
        $autoSuggestionList;


    $autoSuggestionList =  $(`<div class="${CLASS_NAME.autoSuggestionList}"/>`);
    $userChips = $(`<div class="${CLASS_NAME.userChips}" />`);

    this.$selector.wrap(`<div class="${CLASS_NAME.inputNListWrapper}"> </div>`)
    $listWithInput = this.$selector.parent();
    $listWithInput.append($autoSuggestionList);

    $listWithInput.wrap(`<div class="${CLASS_NAME.autoCompleteWrapper}"></div>`);
    $autoSuggestionWrapper = $listWithInput.parent();
    $autoSuggestionWrapper.prepend($userChips);

    this.$chipWrapper = $userChips;
    this.$autoSuggestionList = $autoSuggestionList;
  }


}