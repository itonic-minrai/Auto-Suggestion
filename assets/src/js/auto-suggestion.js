import $ from 'jquery';
import { debounce, forEach, indexOf, uniq, concat, filter, map } from 'lodash';
import AutoSuggestionDOM from './auto-suggestion-dom';
import { ICONS, PREFIX, CLASS_NAME, DEFAULT_CONFIG } from './constants';
import { isElementExistOnDom } from './utils';
import { GET } from './services';

export default class AutoSuggestion extends AutoSuggestionDOM {

  usersList = {};
  $selector = null;
  $userListDom = {};
  currentFocusId = null;
  selectedList = [];

  isListOpen = false;

  constructor(config) {
    super();
    /* Extend merge default config */
    this.config = $.extend({}, DEFAULT_CONFIG, config);
    const { enableDoubleClick, selectedList, selector } = this.config;
    if (!isElementExistOnDom(selector)) return false;

    this.$selector = $(selector);
    this.constructDom();

    this.listenDocumentClick();
    enableDoubleClick && this.handleDoubleClick();
    this.handleChange();
    selectedList.length && this.updateSelectedList(selectedList);
  };


  /**
   * Provide the selected options
   */
  get selectedData() {
    const { usersList, selectedList } = this;
    let returnArr = [];
    forEach(selectedList, id => {
      if (usersList.hasOwnProperty(id)) {
        returnArr.push(usersList[id])
      }
    });
    return returnArr;
  };


  /**
   * Create selected ids chip
   */
  createSelectIdsChip(ids) {
    forEach(this.selectedList, id => this.appendChip(id));
  }


  /**
   * Update the selected list object
   */
  updateSelectedList(ids) {
    let { selectedList } = this;
    if (typeof ids !== "object" && indexOf(ids && selectedList, ids) == -1) {
      ids && selectedList.push(ids);
    } else if (typeof ids === "object") {
      const uniqIds = uniq(ids);
      this.selectedList = concat(selectedList, uniqIds);
    }
    return true;
  };


  /**
   * Listen the keydown event
   */
  handleKeyPress = e => {

    const keyCode = e.keyCode;
    const value = e.target.value;

    switch (keyCode) {

      /* Keydown key press */
      case 40:
        const nextElementId = this.nextElementId;
        if (!this.isListOpen) 
          this.fetchList(value);
        else if (nextElementId) {
          this.removeActive();
          this.addActive(nextElementId);
        }
        return;


      /* Keyup key press */
      case 38:
        const prevElementId = this.prevElementId;
        if (this.isListOpen && prevElementId) {
          this.removeActive();
          this.addActive(prevElementId);
        }
        return;


      /* Enter key  press */
      case 13:
        e.preventDefault();
        const { currentFocusId } = this;

        if (!this.isSelectedNUserListAreEqual && currentFocusId) {
          const nextId = this.nextElementId;
          const prevId = this.prevElementId;
          let nextIdWillBe = null;
          if (nextId) {
            nextIdWillBe = nextId;
          } else if (prevId) {
            nextIdWillBe = prevId;
          };

          this.appendChip(currentFocusId);
          this.removeActive();
          this.addActive(nextIdWillBe);

          /* Show empty list message */
          this.isSelectedNUserListAreEqual && this.appendNoDataTemplate();

          return true;
        };

        this.currentFocusId = null;
        return false;


      /* Default action */
      default:
        this.fetchList(value);
    }
  }


  /**
   * Remove from the selected list
   */
  popFromSelectedList(id) {
    const { selectedList } = this;
    this.selectedList = filter(selectedList, selectedId => selectedId != id);
  };


  /**
   * Handle remove from the list
   */
  handleRemoveChip(e, id) {
    this.popFromSelectedList(id);
    $(e.target).parents('a').remove();
    // this.appendAutoSuggestion(this.$selector);
  }; s


  /**
   * Append user chip on wrapper
   */
  appendChip(id) {
    if (this.usersList.hasOwnProperty(id)) {
      const { $userListDom } = this;
      const chiptemplate = this.getUserChip(id);
      this.$chipWrapper.append(chiptemplate);
      this.updateSelectedList(id);
      $userListDom[id] && $userListDom[id].remove();
    }
  };


  /**
   * Is Provided id is on selected list
   */
  isIdExistOnselectedList = (id) => indexOf(this.selectedList, id) !== -1 ? true : false


  /**
   * Get the matched text values only
   */
  getTextMatchedList(val, usersList) {
    return filter(usersList, (user, id) => {
      const { title } = user;
      return title.toUpperCase().search(val.toUpperCase()) !== -1;
    });
  };


  /**
   * Append the auto suggestion list on dom
   */
/*   appendAutoSuggestion(ele) {
    const val = $(ele).val();
    
  }; */


  /**
   * Check this selected list and total list are equal
   */
  get isSelectedNUserListAreEqual() {
    return Object.keys(this.usersList).length == this.selectedList.length;
  }


  /**
   * Remove user chip from DOM
   */
  handleClickOnList = (e, id) => {
    e.preventDefault();
    this.appendChip(id);
    
    if (this.isSelectedNUserListAreEqual)
      this.appendNoDataTemplate();
  };


  /**
   * Check provided id exist on list dom
   */
  isIdExistOnListDom(id) {
    const { $userListDom } = this;
    return $userListDom.hasOwnProperty(id);
  }


  /**
   * Add active on provided id's DOM element
   */
  addActive(id) {
    const { $userListDom } = this;

    if (this.isIdExistOnListDom(id)) {
      $userListDom[id].addClass(CLASS_NAME.activeClassName);
      this.currentFocusId = id;
    };

  };


  /**
   * Remove ative class from previous selected element
   */
  removeActive() {
    const { currentFocusId, $userListDom } = this;

    if (currentFocusId && this.isIdExistOnListDom(currentFocusId)) {
      $userListDom[currentFocusId].removeClass(CLASS_NAME.activeClassName);
    };
  };


  /**
   * Provide the first element id
   */
  get firstElementId() {
    const listKeys = Object.keys(this.usersList);
    if (listKeys.length) {
      const { id } = this.usersList[listKeys[0]];
      return id;
    }
    return null;
  };


  /**
   * Provide the active element's previous element id
   */
  get prevElementId() {
    const { currentFocusId, $userListDom } = this;
    if (this.isIdExistOnListDom(currentFocusId)) {
      const prevElement = $userListDom[currentFocusId].prev();
      if (prevElement) {
        const prevElementId = prevElement.data('index');
        return prevElementId;
      };
      return null;
    };
    return this.firstElementId;
  }


  /**
   * Provide the active element's next element id
   */
  get nextElementId() {
    const { currentFocusId, $userListDom } = this;
    if (this.isIdExistOnListDom(currentFocusId)) {
      const nextElement = $userListDom[currentFocusId].next();
      if (nextElement) {
        const nextElementId = nextElement.data('index');
        return nextElementId;
      };
      return null;
    };
    return this.firstElementId;
  };


  /**
   * Handle hover event on user list
   */
  handleHoverIn = (e, id) => {
    this.removeActive();
    this.addActive(id);
  };


  /**
   * Provide the unselected ids
   */
  unSelectedIds(userList) {
    return filter(userList, ({ id }) => !this.isIdExistOnselectedList(id));
  };

  /**
   * Get max 100 data
   */
  getLimitedUserData(userList) {
    const { limit } = this.config;
    const cloneUserList = Object.assign({}, userList);
    const userListVal = Object.values(cloneUserList);
    userListVal.length = limit;
    return userListVal;
  };


  bindEventOnList($list, id) {
    $list.on('click', e => this.handleClickOnList(e, id));
    $list.hover(e => this.handleHoverIn(e, id));
  };


  getSuggestionList(unSelectedIds, val) {
    const $fragment = $(document.createDocumentFragment());
    forEach(unSelectedIds, (obj, idx) => {
      const $list = this.getList(obj, val);
      $fragment.append($list);
    });
    return $fragment;
  };




  /**
   * Check provided element exist on DOM
   */
  get isElementExistOnDom() {
    const { selector } = this.config;
    const $selector = $(selector);
  };






  /**
   * Update the user list
   */
  updateUserList(userData) {
    forEach(userData, user => {
      const { type_id, type } = user;
      const id = `${type}-${type_id}`;
      this.usersList[id] = { ...user, id: id };
    });
  };


  /* Append the list on dom */
  appendListToDom( list, value ){
    this.updateUserList(list);
    const autoSuggestionTemplate = this.getTemplate(value);
    if (autoSuggestionTemplate)
      this.$autoSuggestionList.empty().append(autoSuggestionTemplate);
  }


  /**
   * Fetch user list
   */
  fetchList(searchText) {
    const { url } = this.config;
    const searchUrl = searchText ? `${url}?${searchText}` : url;
    const _this = this;

    GET(searchUrl)
      .then(list => this.appendListToDom(list, searchText) )
      .catch(error => {
        console.log(error);
      });
  };



  /* EVENTS  */

  /**
   * Bind Change event on selector (Input Field)
   */
  handleChange() {
    const { debounceTime, fetchAllOnInitial } = this.config;
    this.$selector.on('keyup', debounce(e => {
      this.handleKeyPress(e)
    }, debounceTime));
  }


  /**
   * Bind Double click event on Selector (Input Field)
   */
  handleDoubleClick() {
    const { doubleClick = true } = this.config;

    if(doubleClick)
      this.$selector.dblclick(e => this.handleKeyPress(e) );
  };


  /**
   * Listen event click on dom
   */
  listenDocumentClick() {
    $(document).on('click', e => {
      if (!$(e.target).parents(CLASS_NAME.activeClassName)) {
        this.$autoSuggestionList.empty();
        this.isListOpen = false;
      };
    });
  };


};