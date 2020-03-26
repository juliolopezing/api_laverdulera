module.exports = {
  apps : [{
    name: 'SM_API',
    script: 'supermarket.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT:               41600,
      URLMONGO:           'mongodb://104.248.233.86:27017/',
      USER_MONGO:         'supermarket',
      PASS_MONGO:         '19$up3rKDG',
      BD_MONGO:           'supermarket',
      messageTerminal:    'Welcome',
      tokenjwt:           '6R2FxQE9zM-Z#c+qp8TLZeWRGTe!Vv6*B6hc',
      expiredTime:        3600,//seg
      //MYSQL
      connectionLimit:  20,
      host:             '104.248.233.86',
      user:             'root',
      password:         '$0p0rt3w3b',
      database:         'supermarket'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT:               41600,
      URLMONGO:           'mongodb://172.30.101.196:27017/',
      USER_MONGO:         '',
      PASS_MONGO:         '',
      BD_MONGO:           'supermarket',
      messageTerminal:    'Welcome',
      tokenjwt:           '6R2FxQE9zM-Z#c+qp8TLZeWRGTe!Vv6*B6hc',
      expiredTime:        60*60,//seg*min
      //MYSQL
      connectionLimit:  20,
      host:             'gd-db.vpc-prod.mineduc.gob.gt',
      user:             'gduser',
      password:         'Jdl*s258kf*ew',
      database:         'admondoc'
    }
  }],
};
/*
db.createUser(
    {
      user: "supermarket",
      pwd: "19$up3rKDG",
      roles: [
         { role: "readWrite", db: "supermarket" }
      ]
    }
);
*/