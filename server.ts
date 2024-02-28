import { app } from "./app";
import { env } from "./config/enviroment";
import { connectToMongoose } from "./utils/db";

(async () => {
    try {
        // Attempt to connect to MongoDB
        await connectToMongoose();
        app.listen(env.PORT || 8080, () => {
            console.log(`Server listening on port ${env.PORT || 8080}`);
        });
    } catch (error) {
        console.error('Error connecting to MongoDB or starting the server:', error);
    }
})();