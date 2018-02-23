set NODE_ENV=production
::set REDIS_URL=redis://60.205.168.13:6379
::set MONGO_URL=mongodb://59.110.22.76:27017/duolayimeng
set MONGO_URL=mongodb://localhost:27317/duolayimeng
set ROOT_URL=http://127.0.0.1:7000
set MONGO_URL_LOG=mongodb://127.0.0.1:27017/logs_test
meteor --settings development.json -p 7000