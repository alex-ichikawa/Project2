module.exports = function(sequelize, DataTypes) {
  var Favorite = sequelize.define("Favorite", {
    userNum: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    favId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  Favorite.associate = function(models) {
    Favorite.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  }
  return Favorite;
};
