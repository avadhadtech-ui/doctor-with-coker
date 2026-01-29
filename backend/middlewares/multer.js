const multer = require('multer');

const storage = multer.diskStorage({
    filename: function (req, file, callBack) {
        callBack(null, file.originalname);
    }
});

const upload = multer({ storage });

module.exports = upload;
