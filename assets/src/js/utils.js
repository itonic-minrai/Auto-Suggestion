import $ from 'jquery';

export const isElementExistOnDom = selector => {
  const $selector = $(selector);
  if ($selector.length) {
    return true;
  }
  return false;
};

// export const 
