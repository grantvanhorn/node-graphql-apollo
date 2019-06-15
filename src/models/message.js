const message = (sequelize, DataTypes) => {
  const Message = sequelize.define('message', {
    text: {
      type: DataTypes.STRING,
    },
  });

  Message.assocaite = models => {
    Message.belongsTo(models.User);
  };

  return Message;
};

export default message;