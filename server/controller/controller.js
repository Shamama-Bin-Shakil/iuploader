const User = require("../model/model");
const Image = require("../model/image");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

// User Register Controller
exports.register = async (req, res) => {
  try {
    const { name, acc_email, acc_password } = req.body;

    // Password Hash Convert
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(acc_password, salt);

    let check = await User.findOne({ email: acc_email });
    if (check) {
      return res.send({ error: "Email is already exist" });
    }
    // Create User Account
    const data = new User({
      name: name,
      email: acc_email,
      password: hash,
    });
    const result = await data.save();
    if (result) {
      res.json({ success: "Register Successfully" });
    } else {
      return res.json({ error: "Register Not Successfully" });
    }
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

// User Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const data = await User.findOne({ email });
  if (!data) {
    return res.json({ error: "Invalid Credential" });
  }

  const check_password = await bcrypt.compare(password, data.password);
  if (!check_password) {
    return res.json({ error: "Invalid Credential" });
  }

  const payload = {
    user: {
      user: data.id,
    },
  };

  const token = jwt.sign(payload, SECRET_KEY);
  if (token) {
    req.session.id = data._id;
    req.session.email = data.email;
    res.json({ token });
  }
};

// User Logout Controller:
exports.logout = (req, res) => {
  req.session.destroy(function () {
    console.log("Session Destroy");
  });
  res.redirect("/");
};

// User Password Update:
exports.auth = async (req, res) => {
  const { old_password, new_password } = req.body;
  const check = await User.find({ _id: req.token.user });
  if (!check) {
    return res.json({ error: "Invalid Credential" });
  }

  const passwordVerify = await bcrypt.compare(old_password, check[0].password);
  if (!passwordVerify) {
    return res.json({error: "password do not match"});
  }

  const passwordSalt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(new_password, passwordSalt);

  const passUpdated = {
    password: passwordHash,
  };

  const passwordUpdate = await User.findByIdAndUpdate(
    req.token.user,
    { $set: passUpdated },
    { new: true }
  );

  res.json({ success: "password updated successfully" });
};

// User Profile Detail
exports.userdetail = async (req, res) => {
  const data = await User.find({ _id: req.token.user });
  res.json(data);
};

// User Image Upload Center
exports.uploadimage = async (req, res) => {
  const user = await User.find({ _id: req.token.user });
  if (!user) {
    return res.json({ error: "Access Denied" });
  }
  res.setHeader("Access-Control-Allow-Origin", "*");
  const data = new Image({
    user: user[0]._id,
    name: user[0].name,
    email: user[0].email,
    profileimage: user[0].image,
    image: req.files[0].path,
  });
  const result = await data.save();
  res.json({ result });
};

// Fetch Image All User
exports.fetchimage = async (req, res) => {
  const data = await Image.find();
  let count = data.length;
  res.json({ data, count });
};

// Fetch User Specific Image
exports.userimage = async (req, res) => {
  let str = "";
  let response = "";
  const data = await Image.find({ user: req.token.user });
  let count = data.length;
  data.forEach((element) => {
    str = `<div class="card">
    <div class="card-body">
        <div class="card-img">
            <img src="${element.image}" alt="img support">
        </div>
        <div class="card-detail">
            <span class="card-avater">
                <img src="${element.profileimage}" alt="">
            </span>
            <h3><i>${element.name}</i></h3>
        </div>
        <div class="card-icon">
            <div class="icon-item icon-item-1">
                <a href="">
                    <ion-icon name="heart"></ion-icon>
                </a>
            </div>
            <div class="icon-item icon-item-2">
                <a href="${element.image}" download>
                    <ion-icon name="cloud-download"></ion-icon>
                </a>
            </div>
            <div class="icon-item icon-item-3">
                <button>
                    <ion-icon name="link"></ion-icon>
                </button>
            </div>
            <div class="icon-item icon-item-3">
                <button value="${element.id}" onclick="imageDelete(this)">
                    <ion-icon name="trash-outline"></
                    ion-icon>
                </button>
            </div>
        </div>
    </div>
</div>`;
    response += str;
  });
  res.json({ response, count });
};

// User Profile Image Update
exports.profileimageupload = async (req, res) => {
  const filePath = req.files[0].path;

  const updateUserObject = {
    image: filePath,
  };

  const updateUser = await User.findByIdAndUpdate(
    req.token.user,
    { $set: updateUserObject },
    { new: true }
  );

  res.json({ updateUser });
};

// User Image Delete
exports.userimagedelete = async (req, res) => {
  const { id } = req.body;
  const result = await Image.findByIdAndDelete(id);
  res.json({ result });
};
