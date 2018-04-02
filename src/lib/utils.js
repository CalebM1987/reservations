import moment from 'moment';
export default {
  dateRange: function(mom, days){
    if (!mom){
      let d = new Date();
      mom = moment(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} 00:00:00`);
    }
    if (!days){
      days = 5;
    }
    var arr = [];
    for (var i=1; i <= days; ++i){
      arr.push(mom.clone().add(i, 'd'));
    }
    return arr;
  },

  titleCase: function(str) {
    return str.toLowerCase().split('_').map(function(word) {
      return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
  }
}