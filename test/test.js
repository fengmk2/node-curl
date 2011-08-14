var curl = require("../node_curl");

console.log ("Simple GET");
var req = curl.request ({
    url: "http://localhost:9000"
});
console.log (req.end ());

console.log ("GET with data");
req = curl.request ({
    url: "http://localhost:9000"
});
console.log (req.end ("hello world"));

console.log ("Simple POST");
req = curl.request ({
    url: "http://localhost:9000",
    method: "POST"
});
console.log (req.end ());

console.log ("POST with data");
req = curl.request ({
    url: "http://localhost:9000",
    method: "POST"
});
console.log (req.end ("hello world"));

console.log ("POST with many data");
req = curl.request ({
    url: "http://localhost:9000",
    method: "POST"
});
req.write ("1 line\n");
req.write ("2 line\n");
req.write ("3 line\n");
console.log (req.end ("hello world"));
