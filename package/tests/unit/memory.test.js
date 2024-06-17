const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
} = require("../../src/model/data/memory/index");

describe("memory", () => {
  let ownerId, fragmentId, fragmentData, fragmentMetadata;

  beforeEach(() => {
    ownerId = "user@example.com";
    fragmentId = "123";
    fragmentData = Buffer.from("Hello, World!");
    fragmentMetadata = {
      ownerId,
      id: fragmentId,
      type: "text/plain",
      size: fragmentData.length,
      created: Date.now(),
    };
  });

  describe("writeFragment", () => {
    test("should write fragment metadata to the database", async () => {
      await writeFragment(fragmentMetadata);
      const result = await readFragment(ownerId, fragmentId);
      expect(result).toEqual(fragmentMetadata);
    });
  });

  describe("readFragment", () => {
    test("should read fragment metadata from the database", async () => {
      await writeFragment(fragmentMetadata);
      const result = await readFragment(ownerId, fragmentId);
      expect(result).toEqual(fragmentMetadata);
    });
  });

  describe("writeFragmentData", () => {
    test("should write fragment data to the database", async () => {
      await writeFragmentData(ownerId, fragmentId, fragmentData);
      const result = await readFragmentData(ownerId, fragmentId);
      expect(result).toEqual(fragmentData);
    });
  });

  describe("readFragmentData", () => {
    test("should read fragment data from the database", async () => {
      await writeFragmentData(ownerId, fragmentId, fragmentData);
      const result = await readFragmentData(ownerId, fragmentId);
      expect(result).toEqual(fragmentData);
    });
  });
});
