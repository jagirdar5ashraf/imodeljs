/*---------------------------------------------------------------------------------------------
* Copyright (c) 2018 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/

import { assert, expect } from "chai";
import { Schema } from "../../src/Metadata/Schema";
import { Phenomenon } from "../../src/Metadata/Phenomenon";
import { ECObjectsError } from "../../src/Exception";
import * as sinon from "sinon";
import { JsonParser } from "../../src/Deserialization/JsonParser";

describe("Phenomenon tests", () => {
  let parser = new JsonParser();
  let testPhenomenon: Phenomenon;
  describe("accept", () => {
    beforeEach(() => {
      const schema = new Schema("TestSchema", 1, 0, 0);
      testPhenomenon = new Phenomenon(schema, "TestEnumeration");
    });

    it("should call visitPhenomenon on a SchemaItemVisitor object", async () => {
      expect(testPhenomenon).to.exist;
      const mockVisitor = { visitPhenomenon: sinon.spy() };
      await testPhenomenon.accept(mockVisitor);
      expect(mockVisitor.visitPhenomenon.calledOnce).to.be.true;
      expect(mockVisitor.visitPhenomenon.calledWithExactly(testPhenomenon)).to.be.true;
    });

    it("should safely handle a SchemaItemVisitor without visitPhenomenon defined", async () => {
      expect(testPhenomenon).to.exist;
      await testPhenomenon.accept({});
    });
  });
  describe("Async fromJson", () => {
    beforeEach(() => {
      const schema = new Schema("ExampleSchema", 1, 0, 0);
      testPhenomenon = new Phenomenon(schema, "AREA");
    });
    it("Basic test", async () => {
      const json = {
        $schema: "https://dev.bentley.com/json_schemas/ec/32/draft-01/schemaitem",
        schemaItemType: "Phenomenon",
        name: "AREA",
        label: "Area",
        definition: "Units.LENGTH(2)",
      };
      await testPhenomenon.deserialize(parser.parsePhenomenonProps(json, testPhenomenon.name));
      assert(testPhenomenon.label, "Area");
      assert(testPhenomenon.definition, "Units.LENGTH(2)");
    });
    it("Name must be a valid ECName", async () => {
      const json = {
        $schema: "https://dev.bentley.com/json_schemas/ec/32/draft-01/schemaitem",
        schema: "TestSchema",
        schemaItemType: "Phenomenon",
        name: "12AREA",
        definition: "Units.LENGTH(2)",
      };
      assert.throws(() => testPhenomenon.deserialize(parser.parsePhenomenonProps(json, json.name)), ECObjectsError, `The Phenomenon TestSchema.12AREA has an invalid 'name' attribute. '12AREA' is not a valid ECName.`);
    });
    it("Label must be a string", async () => {
      const json = {
        $schema: "https://dev.bentley.com/json_schemas/ec/32/draft-01/schemaitem",
        schemaItemType: "Phenomenon",
        name: "AREA",
        label: 48,
        definition: "Units.LENGTH(2)",
      };
      assert.throws(() => parser.parseSchemaItemProps(json, testPhenomenon.schema.name, testPhenomenon.name), ECObjectsError, `The SchemaItem ExampleSchema.AREA has an invalid 'label' attribute. It should be of type 'string'.`);

    });
    it("Description must be a string", async () => {
      const json = {
        $schema: "https://dev.bentley.com/json_schemas/ec/32/draft-01/schemaitem",
        schemaItemType: "Phenomenon",
        name: "AREA",
        label: "Area",
        description: 5,
        definition: "Units.LENGTH(2)",
      };
      assert.throws(() => parser.parseSchemaItemProps(json, testPhenomenon.schema.name, testPhenomenon.name), ECObjectsError, `The SchemaItem ExampleSchema.AREA has an invalid 'description' attribute. It should be of type 'string'.`);
    });
    it("Definition is required", async () => {
      const json = {
        $schema: "https://dev.bentley.com/json_schemas/ec/32/draft-01/schemaitem",
        schemaItemType: "Phenomenon",
        name: "AREA",
        label: "Area",
      };
      assert.throws(() => parser.parsePhenomenonProps(json, testPhenomenon.name), ECObjectsError, `The Phenomenon AREA does not have the required 'definition' attribute.`);
    });
    it("Definition must be a string", async () => {
      const json = {
        $schema: "https://dev.bentley.com/json_schemas/ec/32/draft-01/schemaitem",
        schemaItemType: "Phenomenon",
        name: "AREA",
        label: "Area",
        definition: 2,
      };
      assert.throws(() => parser.parsePhenomenonProps(json, testPhenomenon.name), ECObjectsError, `The Phenomenon AREA has an invalid 'definition' attribute. It should be of type 'string'.`);
    });
  });
  describe("Sync fromJson", () => {
    beforeEach(() => {
      const schema = new Schema("ExampleSchema", 1, 0, 0);
      testPhenomenon = new Phenomenon(schema, "AREA");
    });
    it("Basic test", () => {
      const json = {
        $schema: "https://dev.bentley.com/json_schemas/ec/32/draft-01/schemaitem",
        schemaItemType: "Phenomenon",
        name: "AREA",
        label: "Area",
        definition: "Units.LENGTH(2)",
      };
      testPhenomenon.deserializeSync(parser.parsePhenomenonProps(json, testPhenomenon.name))
      assert(testPhenomenon.label, "Area");
      assert(testPhenomenon.definition, "Units.LENGTH(2)");
    });
    it("Name must be a valid ECName", () => {
      const json = {
        $schema: "https://dev.bentley.com/json_schemas/ec/32/draft-01/schemaitem",
        schema: "TestSchema",
        schemaItemType: "Phenomenon",
        name: "12AREA",
        definition: "Units.LENGTH(2)",
      };
      assert.throws(() => testPhenomenon.deserialize(parser.parsePhenomenonProps(json, json.name)), ECObjectsError, `The Phenomenon TestSchema.12AREA has an invalid 'name' attribute. '12AREA' is not a valid ECName.`);
    });
    it("Label must be a string", () => {
      const json = {
        $schema: "https://dev.bentley.com/json_schemas/ec/32/draft-01/schemaitem",
        schemaItemType: "Phenomenon",
        name: "AREA",
        label: 48,
        definition: "Units.LENGTH(2)",
      };
      assert.throws(() => parser.parseSchemaItemProps(json, testPhenomenon.schema.name, testPhenomenon.name), ECObjectsError, `The SchemaItem ExampleSchema.AREA has an invalid 'label' attribute. It should be of type 'string'.`);

    });
    it("Description must be a string", () => {
      const json = {
        $schema: "https://dev.bentley.com/json_schemas/ec/32/draft-01/schemaitem",
        schemaItemType: "Phenomenon",
        name: "AREA",
        label: "Area",
        description: 5,
        definition: "Units.LENGTH(2)",
      };
      assert.throws(() => parser.parseSchemaItemProps(json, testPhenomenon.schema.name, testPhenomenon.name), ECObjectsError, `The SchemaItem ExampleSchema.AREA has an invalid 'description' attribute. It should be of type 'string'.`);
    });
    it("Definition is required", () => {
      const json = {
        $schema: "https://dev.bentley.com/json_schemas/ec/32/draft-01/schemaitem",
        schemaItemType: "Phenomenon",
        name: "AREA",
        label: "Area",
      };
      assert.throws(() => parser.parsePhenomenonProps(json, testPhenomenon.name), ECObjectsError, `The Phenomenon AREA does not have the required 'definition' attribute.`);
    });
    it("Definition must be a string", () => {
      const json = {
        $schema: "https://dev.bentley.com/json_schemas/ec/32/draft-01/schemaitem",
        schemaItemType: "Phenomenon",
        name: "AREA",
        label: "Area",
        definition: 2,
      };
      assert.throws(() => parser.parsePhenomenonProps(json, testPhenomenon.name), ECObjectsError, `The Phenomenon AREA has an invalid 'definition' attribute. It should be of type 'string'.`);
    });
  });
  describe("toJson", () => {
    beforeEach(() => {
      const schema = new Schema("ExampleSchema", 1, 0, 0);
      testPhenomenon = new Phenomenon(schema, "AREA");
    });
    it("async - Basic test", async () => {
      const json = {
        $schema: "https://dev.bentley.com/json_schemas/ec/32/draft-01/schemaitem",
        schemaItemType: "Phenomenon",
        name: "AREA",
        definition: "Units.LENGTH(2)",
      };
      await testPhenomenon.deserialize(parser.parsePhenomenonProps(json, testPhenomenon.name));
      const phenomSerialization = testPhenomenon.toJson(true, true);
      assert(phenomSerialization.definition, "Units.LENGTH(2)");
    });
    it("sync - Basic test", () => {
      const json = {
        $schema: "https://dev.bentley.com/json_schemas/ec/32/draft-01/schemaitem",
        schemaItemType: "Phenomenon",
        name: "AREA",
        definition: "Units.LENGTH(2)",
      };
      testPhenomenon.deserializeSync(parser.parsePhenomenonProps(json, testPhenomenon.name));
      const phenomSerialization = testPhenomenon.toJson(true, true);
      assert(phenomSerialization.definition, "Units.LENGTH(2)");
    });
  });
});
