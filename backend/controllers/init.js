const fs = require("fs").promises;
const path = require("path");

async function initRepo() {
    const repoPath = path.resolve(process.cwd(),".s3git");
    const commitsPath = path.join(repoPath,"commits");
    try {
        await fs.mkdir(repoPath,{ recursive: true });
        await fs.mkdir(commitsPath,{ recursive: true });
        await fs.writeFile(
            path.join(repoPath,"config.json"),
            JSON.stringify({ bucket:process.env.S3_BUCKET })
        );
        console.log("Repositiry Initialized.");
    }
    catch(err){
        console.error("Error initialising the repository.");
    }
}

module.exports={initRepo};