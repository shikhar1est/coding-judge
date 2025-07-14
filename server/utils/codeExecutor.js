const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { v4: uuid } = require("uuid");

const LANG_CONFIG = {
  python: { file: "code.py", dockerfile: "Dockerfile-python" },
  cpp: { file: "code.cpp", dockerfile: "Dockerfile-cpp" },
  javascript: { file: "code.js", dockerfile: "Dockerfile-js" }
};

const executeCode = (code, language, input) => {
  return new Promise((resolve) => {
    const config = LANG_CONFIG[language];
    if (!config) {
      return resolve({ output: "", error: `Language '${language}' not supported` });
    }

    const jobId = uuid();
    const tempDir = path.join("C:/docker-temp", jobId);
    fs.mkdirSync(tempDir, { recursive: true });

    const codePath = path.join(tempDir, config.file);
    const inputPath = path.join(tempDir, "input.txt");
    const dockerfilePath = path.join(tempDir, "Dockerfile");

    fs.writeFileSync(codePath, code);
    fs.writeFileSync(inputPath, input);

    const dockerfileSource = path.join(__dirname, `../../${config.dockerfile}`);
    if (!fs.existsSync(dockerfileSource)) {
      console.error(`Missing Dockerfile: ${config.dockerfile} not found at ${dockerfileSource}`);
      return resolve({ output: "", error: `Dockerfile '${config.dockerfile}' not found in project root` });
    }

    fs.copyFileSync(dockerfileSource, dockerfilePath);

    const imageName = `code-runner-${jobId}`;
    const dockerCommand = `docker build -t ${imageName} . && docker run --rm ${imageName}`;

    exec(dockerCommand, { cwd: tempDir, timeout: 10000 }, (err, stdout, stderr) => {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (e) {
        console.warn("Temp cleanup failed:", e.message);
      }

      if (err) {
        console.error("Docker build/run failed");
        console.error("Command:", dockerCommand);
        console.error("Temp Dir:", tempDir);
        console.error("Docker Error Message:", err.message);
        console.error("Stderr:", stderr);
        return resolve({ output: "", error: stderr || err.message });
      }

      resolve({ output: stdout.trim(), error: null });
    });
  });
};

module.exports = executeCode;
