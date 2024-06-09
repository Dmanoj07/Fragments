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
      throw new Error("ownerId and type are required");
    }
    if (typeof size !== "number" || size < 0) {
      throw new Error("size must be a non-negative number");
    }
    if (!Fragment.isSupportedType(type)) {
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
    const fragments = await listFragments(ownerId, expand);
    if (!expand) {
      return fragments;
    }
    return Promise.all(
      fragments.map(async (fragment) => new Fragment(fragment))
    );
  }

  static async byId(ownerId, id) {
    const fragmentData = await readFragment(ownerId, id);
    return new Fragment(fragmentData);
  }

  static delete(ownerId, id) {
    return deleteFragment(ownerId, id);
  }

  save() {
    this.updated = new Date().toISOString(); // Update the `updated` property
    return writeFragment(this);
  }

  getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  async setData(data) {
    if (!Buffer.isBuffer(data)) {
      throw new Error("data must be a Buffer");
    }
    this.size = data.length;
    this.updated = new Date().toISOString();
    await this.save();
    await writeFragmentData(this.ownerId, this.id, data);
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
    return type.startsWith("text/");
  }
}

module.exports.Fragment = Fragment;
