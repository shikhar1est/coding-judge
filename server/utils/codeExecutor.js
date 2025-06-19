const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { v4: uuid } = require("uuid");

const executeCode = (code, language, input) => {
  return new Promise((resolve, reject) => {
    if (language !== "python") {
      return resolve({ output: "", error: "Only Python supported for now" });
    }

    const jobId = uuid();
    const tempDir = path.join(__dirname, `../temp/${jobId}`);
    fs.mkdirSync(tempDir, { recursive: true });

    const codePath = path.join(tempDir, "code.py");
    const inputPath = path.join(tempDir, "input.txt");
    const dockerfilePath = path.join(tempDir, "Dockerfile");

    fs.writeFileSync(codePath, code);
    fs.writeFileSync(inputPath, input);
    fs.copyFileSync(path.join(__dirname, "../Dockerfile-python"), dockerfilePath);

    const imageName = `code-runner-${jobId}`;
    const dockerCommand = `docker build -t ${imageName} . && docker run --rm ${imageName}`;

    exec(dockerCommand, { cwd: tempDir }, (err, stdout, stderr) => {
      fs.rmSync(tempDir, { recursive: true, force: true }); // Clean temp files

      if (err) {
        return resolve({ output: "", error: stderr || err.message });
      }

      resolve({ output: stdout, error: null });
    });
  });
};

module.exports = executeCode;
