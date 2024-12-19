import logger from "./logger";
import fs from "fs/promises";
// Helper function for avatar cleanup
async function cleanUpAvatar(avatarLocalPath: string) {
    try {
        await fs.unlink(avatarLocalPath);
        logger.info(`Deleted uploaded avatar: ${avatarLocalPath}`);
    } catch (err: any) {
        logger.error(`Failed to delete uploaded avatar: ${err.message}`);
    }
}

export default cleanUpAvatar;