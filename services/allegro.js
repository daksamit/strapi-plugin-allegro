"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  async get(account) {
    const query = strapi.query("allegro", "allegro");
    const accountStorage = await query.findOne({ account });
    return accountStorage ? accountStorage.tokens : null;
  },
  async set(account, tokens) {
    const query = strapi.query("allegro", "allegro");
    const accountStorage = await query.findOne({ account });
    const updatedKey = accountStorage
      ? await query.update({ account }, { tokens })
      : await query.create({ account, tokens });
    return tokens;
  },
};
