'use strict';

exports.index = function(req, res){
  console.log('RES.LOCALS.USER');
  console.log(res.locals.user);
  res.render('home/index', {title: 'Weclome to NoteTaker'});
};
