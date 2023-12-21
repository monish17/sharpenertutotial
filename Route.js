const fs = require('fs');
const requestHandler=(req,res)=>{
    if (req.url === '/home') {
        fs.readFile("message.txt", { encoding: "utf-8" }, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Data from the server:" + data);
            res.setHeader('Content-Type', 'text/html');
            res.write('<html>');
            res.write('<head><title>my first page</title></head>');
            res.write(`<body>${data}</body>`);
            res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">send</button></form></body>');
            res.write('</html>');
            return res.end();
          }
        });
      } else if (req.url === '/message' && req.method === "POST") {
        const body = [];
        req.on('data', (chunk) => {
          body.push(chunk);
          console.log(chunk);
        });
        return req.on('end', () => {
          const parsedbody = Buffer.concat(body).toString();
          console.log(parsedbody);
          const message = parsedbody.split('=')[1];
          fs.writeFile("message.txt", message, (err) => {
            res.statusCode = 302;
            res.setHeader('Location', '/home');
            return res.end();
          });
    
        });
    
      } else {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>my first page</title></head>');
        res.write('<body><h1>Hello from my node js server</h1></body>');
        res.write('</html>');
        res.end();
    }
}
//we can use exports only also which also works if you are doing module.exports.handler=requesthandler only for this type not for below one.
module.exports={
    handler:requestHandler,
    text:'hi there'
};