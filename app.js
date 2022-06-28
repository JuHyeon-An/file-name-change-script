import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ncp from "ncp";
import { fileMap } from "./fileMap.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
    clobber: true,
};

// 대상 파일이 들어있는 폴더명 입력
const folder = process.argv[2];

const basePath = path.join(__dirname, folder);
const smtPath = path.join(__dirname, "smt");
const smtwebPath = path.join(__dirname, "smtweb");
const wooriPath = path.join(__dirname, "wooriib");

const pathArray = [
    { path: smtPath, gubun: "smt" },
    { path: smtwebPath, gubun: "smtweb" },
    { path: wooriPath, gubun: "wooriib" },
];

checkFolder();

console.log(`Processing in ${basePath}...`);

//전달받은 인자가 있으면 (true) 디렉토리 생성
mkFileDir("smt");
mkFileDir("smtweb");
mkFileDir("wooriib");

readFiles(basePath);

function checkFolder() {
    if (!folder) {
        console.log("폴더명을 입력해주세요.");
        return;
    }
}

// 디렉토리 생성
function mkFileDir(gubun) {
    fs.mkdirSync(gubun, { recursive: true }, (err) => {
        if (err) throw err;
    });
}

function readFiles(basePath) {
    fs.promises
        .readdir(basePath) // 현재 경로에 있는 모든 파일 읽어옴
        .then((data) => {
            processFiles(data);
        })
        .catch(console.error);
}

// 해당파일의 종류를 확인하여 처리
function processFiles(data) {
    data.forEach((ele) => {
        if (isPdfFile(ele)) {
            // 스마트뱅킹, 인터넷뱅킹 복사
            copyFiles(ele, "smt", ".pdf");
            copyFiles(ele, "wooriib", ".pdf");
        } else if (isGifFile(ele)) {
            // 스마트웹 복사
            copyFiles(ele, "smtweb", ".gif");
        }
    });

    console.log("jobs all done!");
}

function isGifFile(file) {
    const regExp = /(gif)$/gm;
    const match = file.match(regExp);
    return !!match;
}

function isPdfFile(file) {
    const regExp = /(pdf)$/gm;
    const match = file.match(regExp);
    return !!match;
}

function copyFiles(file, folder, exp) {
    const fName = path.basename(file, exp);

    const pName = fName.split("_")[0];
    const gubun = fName.split("_")[1];

    const newName = fileMap[pName][gubun][folder];

    const targetFile = path.join(basePath, file);
    const temp = path.join(__dirname, folder);
    const copiedFile = path.join(temp, newName);

    ncp(targetFile, copiedFile, options, function (err) {
        if (err) {
            return console.error(err);
        }
        console.log("done");
    });
}
