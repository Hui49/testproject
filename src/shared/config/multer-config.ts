import { BadRequestException } from '@nestjs/common';

const fileFilter = function (req, file, cb) {
  const validTypes = process.env.VALID_FILES_TYPES;
  const regex = new RegExp(validTypes);

  if (!file.mimetype.match(regex)) {
    return cb(
      new BadRequestException('unsupported Mimetype or Extension'),
      false,
    );
  }

  cb(null, true);
};

export const multerOptions = {
  fileFilter,
  limits: { files: 1 },
};