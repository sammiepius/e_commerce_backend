const router = require('express').Router();
const User = require('../models/User');
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('./verifyToken');

//UPDATE

router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE

router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json('user has been deleted....');
  } catch (err) {
    res.json(err);
  }
});

//GET USER

router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    const { password, ...others } = user._doc;

    res.status(200).json({ others });
  } catch (err) {
    res.json(err);
  }
});
//GET ALL USER

router.get('/', verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.json(err);
  }
});

//GET ALL STAT


module.exports = router;

// router.get('/usertest', (req, res) => {
//   res.send('user test is successful');
// });

// router.post('/userposttest', (req, res) => {
//   const username = req.body.username;
//   console.log(username);
//   res.send('your username:' + username);
// });
