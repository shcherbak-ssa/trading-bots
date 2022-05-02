const { MONGODB_USERNAME, MONGODB_PASSWORD } = process.env;


export const DATABASE_URL: string = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.nbfrq.mongodb.net/`;
export const DATABASE_URL_QUERY: string = `?retryWrites=true&w=majority`;
