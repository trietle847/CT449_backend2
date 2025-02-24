const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../app-error");

exports.create = async (req, res, next) => {
  if (!req.body?.name) {
    return next(new ApiError(400, "Name can not be empty"));
  }

  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500,"An error occurred while creating the contact"));
  }
};

exports.findAll = async (req, res, next) => {
  let document = [];
  try {
    const contactService = new ContactService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await contactService.findByName(name);
    } else {
      documents = await contactService.find({});
    }
  } catch (error) {
    return next(new ApiError(500,"An error occurred while retrieving contacts"));
  }
  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404,"Contact not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500,`Error retrieving contact with id=${req.params.id}`));
  }
};

exports.update = async (req, res, next) => {
  const { id } = req.params
  const payload = req.body

 if (Object.keys(payload).length === 0)
   return next(new ApiError(400, "Data to update can not empty"));

  try {
    if (!id) {
      return next(new ApiError(404, "Id update not valid"));
    }
    
    const contactService = new ContactService(MongoDB.client)
    const doc = await contactService.update(id, payload)

    if (!doc)
      return next(new ApiError(404, "contact not found"))
    // res.json(doc);
    return res.send({message: "Contact was updates successfully"});
    
  } catch (error) {
    return next(new ApiError(500,`Error updating contact with id =${id}`));
  }
};

exports.delete = async (req, res, next) => {
  const { id } = req.params
  try {
    const contactService = new ContactService(MongoDB.client);
    const doc = await contactService.delete(id);
    if(!doc) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.send({message : "Contact was deleted successfully"});
  } catch (error) {
    return next(new ApiError(500, `Could not delete contact with id=${id} er=${error}`));
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const deletedCount = await contactService.deleteAll()
    return res.send({
      message: `${deletedCount} contacts were deleted successfully`,
    });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while removing all contacts")
    );
  } 
};

exports.findAllFavorite = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const docs = await contactService.findAllFavorite();
    return res.send(docs);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while retrieving favorite contacts")
    );
  } 
};