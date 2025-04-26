import { serverAuth } from "~/server/utils/auth";

export default eventHandler((event) =>
	serverAuth().handler(toWebRequest(event)),
);
