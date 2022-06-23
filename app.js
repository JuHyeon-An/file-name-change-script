const fs = require("fs");
const path = require("path");

// 대상 파일이 들어있는 폴더명 입력
const folder = process.argv[2];
checkFolder();

function checkFolder() {
    if (!folder) {
        console.log("폴더명을 입력해주세요.");
        return;
    }
}
