import app from "./app";
import connectDb from "./config/db/dbConfig";
import logger from "./utils/logger";

const port = process.env.PORT || 9000;

connectDb().then(() => {
    app.listen(port, () => {
        logger.info(`Server running at port ${port} 🚀`);
    });
});