/* eslint-disable import/no-default-export */
export default () => {
  const port = +(process.env.PORT ?? 8080);
  const mongoHostname = process.env.MONGO_HOSTNAME;

  if (!mongoHostname)
    throw new Error("MONGO_HOSTNAME is required");

  const mongoPort = +(process.env.MONGO_PORT ?? 27017);
  const mongoDb = process.env.MONGO_DB;

  if (!mongoDb)
    throw new Error("MONGO_DB is required");

  const mongoUser = process.env.MONGO_USER;

  if (!mongoUser)
    throw new Error("MONGO_USER is required");

  const mongoPassword = process.env.MONGO_PASSWORD;

  if (!mongoPassword)
    throw new Error("MONGO_PASSWORD is required");

  return {
    port,
    mongo: {
      db: mongoDb,
      host: mongoHostname,
      port: mongoPort,
      user: mongoUser,
      password: mongoPassword,
    },
  };
};
