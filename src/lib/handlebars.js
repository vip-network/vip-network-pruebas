const helps =  require('handlebars')


helps.registerHelper("ifCond", function(v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

helps.registerHelper("isSelected", function (Country, key) {
  return Country === key ? 'selected' : ''; 
})


module.exports = helps;
