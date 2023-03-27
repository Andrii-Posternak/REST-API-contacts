const Contact = require("../models/contact");
const { RequestError } = require("../helpers");
const { schema, schemaFavorite, schemaQuery } = require("../schemas");

const getContacts = async (req, res, next) => {
  try {
    let result = [];
    const { id: owner } = req.user;
    const contacts = await Contact.find(
      { owner },
      "-createdAt -updatedAt"
    ).populate("owner", "name email");
    result = [...contacts];

    const { error } = schemaQuery.validate(req.query);
    if (error) {
      throw RequestError(400, "Invalid query data");
    } else {
      const { favorite, page, limit } = req.query;
      if (favorite === "true") {
        const filteredByFavorite = result.filter(
          (contact) => contact.favorite === true
        );
        result = [...filteredByFavorite];
      }
      if (page && limit) {
        const pagination = result.slice((page - 1) * limit, page * limit);
        result = [...pagination];
      }
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { id: owner } = req.user;
    const result = await Contact.findOne({
      $and: [{ _id: contactId }, { owner }],
    });
    if (!result) {
      throw RequestError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      throw RequestError(400, "Missing required name field");
    }
    const { id: owner } = req.user;
    const result = await Contact.create({ ...req.body, owner });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { id: owner } = req.user;
    const result = await Contact.findOneAndRemove({
      $and: [{ _id: contactId }, { owner }],
    });
    if (!result) {
      throw RequestError(404, "Not found");
    }
    res.json({ message: "Contact deleted" });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      throw RequestError(400, "missing fields");
    }
    const { contactId } = req.params;
    const { id: owner } = req.user;
    const result = await Contact.findOneAndUpdate(
      {
        $and: [{ _id: contactId }, { owner }],
      },
      req.body,
      {
        new: true,
      }
    );
    if (!result) {
      res.status(404).json({ message: "Not found" });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { error } = schemaFavorite.validate(req.body);
    if (error) {
      throw RequestError(400, "Missing field favorite");
    }
    const { contactId } = req.params;
    const { id: owner } = req.user;
    const result = await Contact.findOneAndUpdate(
      {
        $and: [{ _id: contactId }, { owner }],
      },
      req.body,
      {
        new: true,
      }
    );
    if (!result) {
      res.status(404).json({ message: "Not found" });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
};
