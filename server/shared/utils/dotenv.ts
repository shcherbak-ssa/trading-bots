const env = require('dotenv-flow').config({
  default_node_env: 'production',
});

export default { env: env.parsed };
