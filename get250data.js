var fs = require("fs");
var http = require("https");
var promisify = require("util").promisify;
var readFile = promisify(fs.readFile);

async function job() {
  let file = await readFile("./data2.json", { encoding: "utf-8" });
  var data = JSON.parse(file);
  console.log(
    JSON.stringify(
      data.map(v => {
        var money;
        if (v.boxOffice === "N/A") {
          money = 0;
        } else {
          money = Number(
            v.boxOffice
              .slice(1)
              .split(",")
              .join("")
          );
        }
        return Object.assign({}, v, { boxOffice: money });
      })
    )
  );
}

job();
