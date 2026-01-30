document.getElementById("test-button").addEventListener("click", () => {
    const resultDiv = document.getElementById("test-result");
    const vulnerable = typeof require !== "undefined";

    resultDiv.style.display = "block";

    if (!vulnerable) {
        resultDiv.innerHTML = "<strong style='color: #51cf66'>SAFE</strong>: require() is not defined.";
    } else {
        resultDiv.innerHTML = "<strong style='color: #ff0055'>VULNERABLE</strong>: require() is exposed.";
    }

});

document.getElementById("showcase-button").addEventListener("click", () => {
    if (!confirm("If vulnerable, this will execute a .bat file in your temp folder. Do you want to continue?")) return;
    const resultDiv = document.getElementById("showcase-result");
    const vulnerable = typeof require !== "undefined";

    resultDiv.style.display = "block";

    if (!vulnerable) {
        resultDiv.innerHTML = "<strong style='color: #51cf66'>SAFE</strong>: require() is not defined.";
        return;
    }

    try {
        const os = require("os");
        const {exec} = require("child_process");
        const path = require("path");
        const fs = require("fs");

        if (os.platform() !== "win32") {
            resultDiv.innerHTML = "<strong>VULNERABLE</strong> (Test is Windows only, but require() is exposed).";
            return;
        }

        const bat = "@echo off\ncolor 4F\ncls\necho IMPORTANT: YOUR CLIENT IS VULNERABLE\necho.\npause";
        const temp = path.join(os.tmpdir(), "test.bat");
        fs.writeFileSync(temp, bat);

        exec(`start cmd /k "${temp}"`);

        resultDiv.innerHTML = `
            <strong style="color: #ff0055">VULNERABLE</strong>:<br>
            A command prompt should have opened.<br>
            User: ${os.userInfo().username}<br>
            Hostname: ${os.hostname()}
        `;

    } catch (e) {
        resultDiv.innerHTML = `Error running test: ${e.message}`;
    }
});