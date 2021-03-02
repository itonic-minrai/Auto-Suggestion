import $ from 'jquery';
import '../scss/style.scss';
import AutoSuggestion from './auto-suggestion';

$(document).ready( ()=>{
  window.autoSuggestion = new AutoSuggestion({
    url: 'http://localhost:3004/users',
    selector: '#auto-suggestion',
    enableDoubleClick: true,
    selectedList: [ "user-2", "user-3"],
    fetchAllOnInitial: false,
  });
})

