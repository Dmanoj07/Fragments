const { randomUUID } = require("crypto");
const contentType = require("content-type");
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require("./data");
const logger = require("../../src/logger"); // Import the logger module

class Fragment {
  constructor({
    id = randomUUID(),
    ownerId,
    created = new Date().toISOString(),
    updated = new Date().toISOString(),
    type,
    size = 0,
  }) {
    if (!ownerId || !type) {
      logger.error("ownerId and type are required");
      throw new Error("ownerId and type are required");
    }
    if (typeof size !== "number" || size < 0) {
      logger.error("size must be a non-negative number");
      throw new Error("size must be a non-negative number");
    }
    if (!Fragment.isSupportedType(type)) {
      logger.warn(`Unsupported type: ${type}`);
      throw new Error(`Unsupported type: ${type}`);
    }

    this.id = id;
    this.ownerId = ownerId;
    this.created = created;
    this.updated = updated;
    this.type = type;
    this.size = size;
  }

  static async byUser(ownerId, expand = false) {
    try {
      const fragments = await listFragments(ownerId, expand);
      if (fragments.length === 0) {
        return [];
      }
      if (!expand) {
        return fragments;
      }
      return fragments.map((fragmentData) => new Fragment(fragmentData));
    } catch (err) {
      logger.error(
        `Error fetching fragments for user ${ownerId}: ${err.message}`
      );
      throw err;
    }
  }

  static async byId(ownerId, id) {
    try {
      const fragmentData = await readFragment(ownerId, id);
      logger.debug(`Fetched fragment data: ${JSON.stringify(fragmentData)}`);
      if (!fragmentData) {
        throw new Error(`Unable to find id: ${id}'`);
      }
      const fragment = new Fragment(fragmentData);

      //fragment.size = data.length;
      return fragment;
    } catch (err) {
      logger.error(`Error fetching fragment with ID ${id}: ${err.message}`);
      throw err;
    }
  }

  static delete(ownerId, id) {
    try {
      return deleteFragment(ownerId, id);
    } catch (err) {
      logger.error(`Error deleting fragment with ID ${id}: ${err.message}`);
      throw err;
    }
  }

  save() {
    this.updated = new Date().toISOString();
    try {
      return writeFragment(this);
    } catch (err) {
      logger.error(`Error saving fragment with ID ${this.id}: ${err.message}`);
      throw err;
    }
  }

  getData() {
    try {
      return readFragmentData(this.ownerId, this.id);
    } catch (err) {
      logger.error(
        `Error fetching data for fragment with ID ${this.id}: ${err.message}`
      );
      throw err;
    }
  }

  async setData(data) {
    if (!Buffer.isBuffer(data)) {
      logger.error("Data must be a Buffer");
      throw new Error("Data must be a Buffer");
    }
    this.size = data.length;
    this.updated = new Date().toISOString();
    try {
      logger.debug("Saving fragment metadata...");
      await this.save();
      logger.debug("Writing fragment data...");
      await writeFragmentData(this.ownerId, this.id, data);
      logger.debug("Fragment data written successfully");
    } catch (err) {
      logger.error(
        `Error setting data for fragment with ID ${this.id}: ${err.message}`
      );
      throw err;
    }
  }

  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  get isText() {
    return this.mimeType.startsWith("text/");
  }

  get formats() {
    return [this.mimeType];
  }

  static isSupportedType(value) {
    const { type } = contentType.parse(value);
    const supportedTypes = ["text/plain", "text/markdown", "application/json"];
    return supportedTypes.includes(type) || type.startsWith("text/");
  }
}

module.exports.Fragment = Fragment;
