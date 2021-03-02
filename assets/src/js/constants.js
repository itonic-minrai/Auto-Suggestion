export const ICONS = {
  close: `<svg xmlns="http://www.w3.org/2000/svg" height="11px" viewBox="0 0 329.26933 329" width="11px"><path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"/></svg>`,
};

export const PREFIX = `itonics`;

export const excludeKeycode = [ 40, 38, 13 ];

export const CLASS_NAME = {
  autoCompleteWrapper: `${PREFIX}-autocomplete-wrapper`,
  autoSuggestionList: `${PREFIX}-autocomplete-items-list`,
  userChips: `${PREFIX}-autocomplete-user-chips`,
  inputNListWrapper: `${PREFIX}-wrapper-with-input-n-list`,
  listWrapperClassName: `${PREFIX}-autocomplete-items-wrapper`,
  fetchingClassName: `${PREFIX}-fetching`,
};

export const DEFAULT_CONFIG = {
  selector: '#auto-suggestion',
  enableDoubleClick: true,
  selectedList: [],
  limit: 150,
  noDataText: 'No Matching Data Found',
  debounceTime: 250,
  defaultImg: 'https://itonics-v3-test.s3.eu-central-1.amazonaws.com/nucleus.dev.itonicsit.de/s3fs-public/styles/user-profile/public/default_images/tr3_user_default.png',
  userIcon: '<i class="f-icon icon1-user"></i>'
};