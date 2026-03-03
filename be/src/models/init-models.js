var DataTypes = require("sequelize").DataTypes;
var _i_category_board = require("./i_category_board");

function initModels(sequelize) {
  var i_category_board = _i_category_board(sequelize, DataTypes);


  return {
    i_category_board,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
