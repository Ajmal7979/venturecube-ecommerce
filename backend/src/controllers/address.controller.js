const User = require("../models/User");


exports.addAddress = async (req, res) => {
  const user = await User.findById(req.user._id);

  user.addresses.push(req.body);
  await user.save();

  res.status(201).json({
    message: "Address added",
    addresses: user.addresses,
  });
};


exports.getAddresses = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user.addresses);
};


exports.deleteAddress = async (req, res) => {
  const { index } = req.params;

  const user = await User.findById(req.user._id);

  if (!user.addresses[index]) {
    return res.status(404).json({ message: "Address not found" });
  }

  user.addresses.splice(index, 1);
  await user.save();

  res.json({
    message: "Address deleted",
    addresses: user.addresses,
  });
};
