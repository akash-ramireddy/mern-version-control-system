const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

async function commitRepo(message) {
    const repoPath = path.join(process.cwd(),".s3git");
    const stagedPath = path.join(repoPath,"staging");
    const commitPath = path.join(repoPath,"commits");
    try{
        const commitId = uuidv4();
        const commitDir = path.join(commitPath,commitId);
        await fs.mkdir(commitDir,{recursive:true});

        const files = await fs.readdir(stagedPath);
        for(const file of files){
            await fs.copyFile(
                path.join(stagedPath,file),
                path.join(commitDir,file)
            );
        }

        await fs.writeFile(
            path.join(commitDir,commitId),
            JSON.stringify({message,date:new Date().toISOString()})
        );

        console.log(`Commit ${commitId} created with message: ${message}`);
    }
    catch(err){
        console.error("Error commiting files: ",err);
    }
}

module.exports={commitRepo};