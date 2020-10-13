const PORT = 8000;

const http = require("http");
const httpProxy = require("http-proxy");

const proxy = httpProxy.createProxyServer({
  target: "http://192.168.1.5:9999/", //接口地址
  changeOrigin: true,
  // 下面的设置用于https
  // ssl: {
  //     key: fs.readFileSync('server_decrypt.key', 'utf8'),
  //     cert: fs.readFileSync('server.crt', 'utf8')
  // },
  // secure: false
});

proxy.on("proxyReq", function (proxyReq, req, res, options) {});

proxy.on("proxyRes", function (proxyRes, req, res, options) {
  proxyRes.headers["Access-Control-Allow-Origin"] = "*";
});

proxy.on("error", function (err, req, res) {
  res.writeHead(500, {
    "content-type": "text/plain",
  });
  console.log(err);
  res.end("Something went wrong. And we are reporting a custom error message.");
});

const server = http.createServer(function (request, response) {
  proxy.web(request, response);
});
server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");
