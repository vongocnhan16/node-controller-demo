const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');

// Khởi tạo GCP Storage
const storage = new Storage({
  keyFilename: '/Users/mac/Desktop/node-postgres-demo/gcp-steve-123-232643f6d449.json',
  projectId: 'gcp-steve-123',
});

const BUCKET_NAME = 'bucket_uploads_prod'; // bucket duy nhất

// =====================
// Liệt kê file trong bucket theo user
// =====================
const index = async (req, res) => {
  try {
    const folderPath = `Users/_${req.user.user_id}/documents/`; // folder theo user

    const [files] = await storage.bucket(BUCKET_NAME).getFiles({
      prefix: folderPath,
    });

    const fileList = files.map(file => ({
      name: file.name.replace(folderPath, ''), // chỉ lấy tên file
      url: file.publicUrl(),
      size: file.metadata.size,
      content_type: file.metadata.contentType,
      updated_at: file.metadata.updated,
    }));

    res.json({ files: fileList });
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: 'Bucket not found or error reading files' });
  }
};

// =====================
// Upload file lên bucket theo user
// =====================
const create = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const folderPath = `Users/_${req.user.user_id}/documents/`; // folder theo user
    const pathInBucket = `${folderPath}${Date.now()}_${file.originalname}`;

    const [uploadedFile] = await storage.bucket(BUCKET_NAME).upload(file.path, {
      destination: pathInBucket,
      metadata: { contentType: file.mimetype },
    });

    // Xoá file temp local
    fs.unlinkSync(file.path);

    res.json({
      message: 'File uploaded successfully',
      file_name: uploadedFile.name.replace(folderPath, ''),
      url: uploadedFile.publicUrl(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// =====================
// Xóa file trong bucket theo user
// =====================
const destroy = async (req, res) => {
  try {
    const filename = req.params.filename;
    const folderPath = `Users/_${req.user.user_id}/documents/`; // folder theo user

    const file = storage.bucket(BUCKET_NAME).file(`${folderPath}${filename}`);
    await file.delete();

    res.json({ message: `File '${filename}' deleted successfully` });
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: 'File not found or error deleting' });
  }
};

module.exports = { index, create, destroy };
