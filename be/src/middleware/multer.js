const multer = require('multer');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

const fileStorage = destination =>
    multer.diskStorage({
        destination: (req, file, cb) => {
            // 절대경로로 변환: process.cwd() 기준 상대경로 처리
            const fullPath = path.isAbsolute(destination) ? destination : path.join(process.cwd(), destination);
            console.log('Destination:', fullPath);
            console.log('Original destination:', destination); // 원본 경로도 로그로 남김
            // 업로드 경로가 존재하지 않으면 생성
            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath, { recursive: true });
                console.log(`Created directory: ${fullPath}`);
            }
            cb(null, destination);
        },
        filename: (req, file, cb) => {
            // 원래 파일 이름을 인코딩 문제 없이 그대로 사용
            // const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
            const originalName = file.originalname;
            const _fileLen = originalName.length;
            const _lastDot = originalName.lastIndexOf('.') + 1;
            // const fileNameWithoutExt = originalName.substring(0, _lastDot - 1);
            const _fileExt = originalName.substring(_lastDot, _fileLen).toLowerCase();
            // 랜덤 숫자 생성
            const randomNum = String(Math.floor(100000 + Math.random() * 900000));
            // 최종 파일 이름 구성
            const _fileName =
                // fileNameWithoutExt + '_' +
                moment().format('YYYYMMDDHHmmssSSS') + randomNum + '.' + _fileExt;

            // file.path를 상대 경로로 설정하기 위해 원본 destination 저장
            // file._originalDestination = destination;

            cb(null, _fileName);
        },
    });

const cndFileStorage = destination =>
    multer.diskStorage({
        destination: (req, file, cb) => {
            // 절대경로로 변환: process.cwd() 기준 상대경로 처리
            const fullPath = path.isAbsolute(destination) ? destination : path.join(process.cwd(), destination);
            console.log('Destination:', fullPath);
            console.log('Original destination:', destination); // 원본 경로도 로그로 남김
            // 업로드 경로가 존재하지 않으면 생성
            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath, { recursive: true });
                console.log(`Created directory: ${fullPath}`);
            }
            cb(null, destination);
        },
        filename: (req, file, cb) => {
            const originalName = file.originalname;
            const filePath = path.join(
                path.isAbsolute(destination) ? destination : path.join(process.cwd(), destination),
                originalName,
            );

            // req.body.overwrite가 'Y'면 파일 오버라이트 허용
            if (req.query.overwrite === 'Y') {
                // 기존 파일이 있으면 삭제
                if (fs.existsSync(filePath)) {
                    try {
                        fs.unlinkSync(filePath);
                    } catch (err) {
                        console.error('기존 파일 삭제 실패:', err);
                        return cb(new Error('기존 파일 삭제 실패'));
                    }
                }
                return cb(null, originalName);
            }

            // 파일이 이미 존재하면 에러 반환
            if (fs.existsSync(filePath)) {
                const errorMessage = `이미 존재하는 파일명입니다: ${originalName}`;
                console.error(errorMessage);

                const error = new Error(errorMessage);
                error.statusCode = 409; // 예: 409 Conflict
                return cb(error);
            }

            cb(null, originalName);
        },
    });

const allowedMimeTypes = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'application/pdf',
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-powerpoint', // .ppt
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/x-hwp', // HWP files
    'application/zip', // ZIP files
    'text/plain',
    'video/mpg', // MPG
    'video/mpeg', // MPEG
    'video/avi', // AVI
    'video/x-ms-wmv', // WMV
    'video/x-ms-asf', // ASF
    'video/x-ms-asx', // ASX
    'video/mp4', // MP4
    'application/haansoftxlsx', // 한컴오피스 Excel 파일
];

const fileFilter = (req, file, cb) => {
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    if (allowedMimeTypes.includes(file.mimetype) && fileExtension !== 'exe') {
        cb(null, true); // 파일을 허용합니다.
    } else {
        console.log(file);
        console.log(`file.mimetype : ${file.mimetype}`);
        console.log(`fileExtension : ${fileExtension}`);
        const errorMessage = `허용되지 않는 파일 형식입니다.`;
        cb(new Error(errorMessage), false); // 에러 메시지와 함께 파일을 거부합니다.
    }
};

// exports.clearFile = async (filePath) => {
//     if (fs.existsSync(filePath)) {
//         filePath = path.join(__dirname, '../../', filePath);
//         fs.unlink(filePath, err => console.log(err));
//     }
// };
exports.clearFile = async filePath => {
    const fullPath = path.join(__dirname, '../../', filePath);
    if (fs.existsSync(fullPath)) {
        try {
            await fs.promises.unlink(fullPath);
            console.log('파일 삭제 완료:', filePath);
        } catch (err) {
            console.error('파일 삭제 실패:', err);
        }
    }
};

// Add a file size limit (in bytes)
const fileSizeLimit = (Number(process.env.FILESIZE) || 5) * 1024 * 1024; // 기본 5MB
const fieldSizeLimit = 50 * 1024 * 1024; // 50MB

exports.fileMulter = multer({
    storage: fileStorage('storage/board'),
    fileFilter: fileFilter,
    limits: { fileSize: fileSizeLimit, fieldSize: fieldSizeLimit },
}).fields([
    { name: 'b_file', maxCount: 10 },
    { name: 'b_img', maxCount: 1 },
]);

exports.menuFileMulter = multer({
    storage: fileStorage('storage/menu'),
    fileFilter: fileFilter,
    limits: { fileSize: fileSizeLimit, fieldSize: fieldSizeLimit },
}).fields([
    { name: 'c_main_banner_file', maxCount: 1 },
    { name: 'c_menu_on_img', maxCount: 1 },
    { name: 'c_menu_off_img', maxCount: 1 },
]);

exports.groupFileMulter = multer({
    storage: fileStorage('storage/menu'),
    fileFilter: fileFilter,
    limits: { fileSize: fileSizeLimit },
}).fields([
    { name: 'g_img_on', maxCount: 1 },
    { name: 'g_img_off', maxCount: 1 },
]);

exports.bannerMulter = multer({
    storage: fileStorage('storage/banner'),
    fileFilter: fileFilter,
    limits: { fileSize: fileSizeLimit },
}).single('b_file');

exports.cdnMulter = multer({
    storage: cndFileStorage('storage/cdn'),
    fileFilter: fileFilter,
    limits: { fileSize: fileSizeLimit, fieldSize: fieldSizeLimit },
}).fields([{ name: 'sessions', maxCount: 20 }]);
