const request = require("request-promise");
const cheerio = require("cheerio");
var mysql = require('mysql');

var db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "kodepos"
});

async function main() {
  tbl = [];
  var p;
  db.connect(function (err) {
    if (err) throw err;
  });
  for (p = 2; p <= 417; p++) {
    //tbl = [];
    const result = await request.get("https://www.nomor.net/_kodepos.php?_i=desa-kodepos&perhal=200&urut=&asc=000101&sby=010000&no1=" + ((p - 2) * 200 + 1) + "&no2=" + ((p - 1) * 200));
    const $ = cheerio.load(result);
    row = [];

    $("body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td > table:nth-child(4) > tbody > tr").each((index, element) => {
      if (index > 1) {
        var i;
        for (i = 0; i <= 7; i++) {
          r = $($(element).find("td")[i]).text();
          row.push(r)
        }
        tbl.push(row);
        row = [];
      }
    });

    if (tbl.length > 0) {
      db.query("INSERT INTO kodepos VALUES ?", [tbl], function (err, result) {
        if (err) throw err;
        console.log("inserted " + p + "/417");
        tbl = [];
        //db.end();
      });

    }
  }

}
main()