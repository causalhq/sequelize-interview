"use strict";

const chai = require("chai");

const expect = chai.expect;
const Support = require("../../support");

const dialect = Support.getTestDialect();
const { DataTypes, Op, json } = require("@sequelize/core");

describe.only("[POSTGRES Specific] DAO", () => {
  if (dialect !== "postgres") {
    return;
  }

  describe("enums", () => {
    it("should be able to ignore enum types that already exist", async function () {
      const User = this.sequelize.define("UserEnums", {
        mood: DataTypes.ENUM("happy", "sad", "meh"),
      });

      await User.sync({ force: true });

      await User.sync();
    });

    it("should be able to create/drop enums multiple times", async function () {
      const User = this.sequelize.define("UserEnums", {
        mood: DataTypes.ENUM("happy", "sad", "meh"),
      });

      await User.sync({ force: true });

      await User.sync({ force: true });
    });

    it("should be able to create/drop multiple enums multiple times", async function () {
      const DummyModel = this.sequelize.define("Dummy-pg", {
        username: DataTypes.STRING,
        theEnumOne: {
          type: DataTypes.ENUM(["one", "two", "three"]),
        },
        theEnumTwo: {
          type: DataTypes.ENUM(["four", "five", "six"]),
        },
      });

      await DummyModel.sync({ force: true });
      // now sync one more time:
      await DummyModel.sync({ force: true });
      // sync without dropping
      await DummyModel.sync();
    });

    it("should be able to create/drop multiple enums multiple times with field name (#7812)", async function () {
      const DummyModel = this.sequelize.define("Dummy-pg", {
        username: DataTypes.STRING,
        theEnumOne: {
          field: "oh_my_this_enum_one",
          type: DataTypes.ENUM(["one", "two", "three"]),
        },
        theEnumTwo: {
          field: "oh_my_this_enum_two",
          type: DataTypes.ENUM(["four", "five", "six"]),
        },
      });

      await DummyModel.sync({ force: true });
      // now sync one more time:
      await DummyModel.sync({ force: true });
      // sync without dropping
      await DummyModel.sync();
    });

    it("should be able to add values to enum types", async function () {
      let User = this.sequelize.define("UserEnums", {
        mood: DataTypes.ENUM("happy", "sad", "meh"),
      });

      await User.sync({ force: true });
      User = this.sequelize.define("UserEnums", {
        mood: DataTypes.ENUM(
          "neutral",
          "happy",
          "sad",
          "ecstatic",
          "meh",
          "joyful"
        ),
      });

      await User.sync();
      const enums = await this.sequelize
        .getQueryInterface()
        .pgListEnums(User.getTableName());
      expect(enums).to.have.length(1);
      expect(enums[0].enum_value).to.deep.equal([
        "neutral",
        "happy",
        "sad",
        "ecstatic",
        "meh",
        "joyful",
      ]);
    });

    it("should be able to add multiple values with different order", async function () {
      let User = this.sequelize.define("UserEnums", {
        priority: DataTypes.ENUM("1", "2", "6"),
      });

      await User.sync({ force: true });
      User = this.sequelize.define("UserEnums", {
        priority: DataTypes.ENUM("0", "1", "2", "3", "4", "5", "6", "7"),
      });

      await User.sync();
      const enums = await this.sequelize
        .getQueryInterface()
        .pgListEnums(User.getTableName());
      expect(enums).to.have.length(1);
      expect(enums[0].enum_value).to.deep.equal([
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
      ]);
    });
  });
});
