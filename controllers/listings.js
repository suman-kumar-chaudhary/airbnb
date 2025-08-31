const Listing = require("../models/listings.js");
const maptilerClient = require("@maptiler/client");
const Map_TOKEN = process.env.Map_TOKEN;
maptilerClient.config.apiKey = Map_TOKEN;

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

module.exports.newListing = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "you requested listing does not exits");
    res.redirect("/listings");
  } else {
    res.render("./listings/show.ejs", { listing });
  }
};

module.exports.createListing = async (req, res, next) => {
  const response = await maptilerClient.geocoding.forward(
    req.body.listing.location,
    {
      limit: 1,
    }
  );

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.features[0].geometry;
  await newListing.save();
  req.flash("success", "Your New Listing Is Added");
  res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "you requested listing does not exits");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("./listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  const response = await maptilerClient.geocoding.forward(
    req.body.listing.location,
    {
      limit: 1,
    }
  );
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
  );

  let data = response.features[0].geometry;
  listing.geometry = data;
  await listing.save();

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {
      url,
      filename,
    };
    await listing.save();
  }

  req.flash("success", "Your Listing Is Edited");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Your listing deleted successfully");
  res.redirect("/listings");
};
