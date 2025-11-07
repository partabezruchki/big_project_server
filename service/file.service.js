const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

class FileService {
  saveFile(file) {
    try {
      const fileName = uuidv4() + ".jpg";
      const currentDir = __dirname;
      const staticDir = path.join(currentDir, "..", "public");
      const filePath = path.join(staticDir, fileName);

      if (!fs.existsSync(staticDir)) {
        fs.mkdirSync(staticDir, { recursive: true });
      }

      file.mv(filePath);
      return fileName;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  userImage(file) {
    try {
      const fileName = uuidv4() + ".jpg";
      const currentDir = __dirname;
      const staticDir = path.join(currentDir, "..", "public/user");
      const filePath = path.join(staticDir, fileName);

      if (!fs.existsSync(staticDir)) {
        fs.mkdirSync(staticDir, { recursive: true });
      }

      file.mv(filePath);
      return fileName;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  // async deleteFile(fileName) {
  //     const filePath = path.join(__dirname, "../public", fileName);
  //     fs.unlinkSync(filePath);
  // }
  // async updateFile(fileName, file) {
  //     const filePath = path.join(__dirname, "../public", fileName);
  //     fs.unlinkSync(filePath);
  //     const newFileName = uuidv4() + path.extname(file.originalname);
  //     const newFilePath = path.join(__dirname, "../public", newFileName);
  //     await file.mv(newFilePath);
  //     return newFileName;
  // }
  // async getFile(fileName) {
  //     const filePath = path.join(__dirname, "../public", fileName);
  //     return filePath;
  // }
  // async getFiles() {
  //     const files = fs.readdirSync(path.join(__dirname, "../public"));
  //     return files;
  // }
  // async deleteAllFiles() {
  //     const files = fs.readdirSync(path.join(__dirname, "../public"));
  //     files.forEach(file => {
  //         fs.unlinkSync(path.join(__dirname, "../public", file));
  //     });
  // }
}
module.exports = new FileService();
