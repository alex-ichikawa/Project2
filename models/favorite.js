module.exports = function(sequelize, DataTypes) {
  var Favorite = sequelize.define("Favorite", {
    userNum: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    favId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    favName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    favAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    favRisk: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    favResult: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    favViolations: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    favDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
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
