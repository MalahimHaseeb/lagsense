const fs = require("fs");
const path = require("path");

exports.default = async function (context) {
  if (context.electronPlatformName !== "linux") {
    return;
  }

  const sandboxPath = path.join(
    context.appOutDir,
    "chrome-sandbox"
  );

  if (fs.existsSync(sandboxPath)) {
    fs.chmodSync(sandboxPath, 0o4755);

    console.log(
      `Fixed chrome-sandbox permissions: ${sandboxPath}`
    );
  }
};