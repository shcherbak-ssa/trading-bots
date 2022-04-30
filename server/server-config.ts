import path from 'path';


const staticDirname: string = path.join(process.cwd(), 'build', 'client');
const entryPointFilename: string = path.join(staticDirname, 'index.html');


export const serverConfig = {
  staticDirname,
  entryPointFilename,

  server: {
    port: Number(process.env.SERVER_PORT) || 3333,
    host: process.env.SERVER_HOST || 'localhost',
  },
};
