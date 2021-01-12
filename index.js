var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);
var db = new sqlite3.Database('database.db');

db.run('CREATE TABLE IF NOT EXISTS produk(id INTEGER AUTOINCREMENT, nama_produk TEXT, keterangan TEXT, harga INTEGER, jumlah INTEGER)');

const hostname = '127.0.0.1';
const port = 3000;



server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.get('/add/:id/:nama_produk/:keterangan/:harga/:jumlah', function(req,res){
    db.serialize(()=>{
      db.run('INSERT INTO produk(nama_produk, keterangan, harga, jumlah) VALUES(?,?,?,?)', [req.params.id, req.params.nama_produk,req.params.keterangan,req.params.harga,req.params.jumlah], function(err) {
        if (err) {
          return console.log(err.message);
        }
        console.log("Berhasil menambahkan produk baru");
        res.send("Produk baru telah ditambahkan ke basis data dengan data ID = "+req.params.id+ ", Nama Produk = "+req.params.nama_produk + " Keterangan = "+req.params.keterangan+ ", Harga = "+req.params.harga+ ", Jumlah = "+req.params.jumlah );
      });});});

app.get('/view/:id', function(req,res){
  db.serialize(()=>{
    db.each('SELECT id ID, nama_produk NAMA_PRODUK, keterangan KETERANGAN, harga HARGA, jumlah JUMLAH FROM produk WHERE id =?', [req.params.id], function(err,row){     
      if(err){
        res.send("Terjadi kesalahan saat menampilkan");
        return console.error(err.message);
      }
      res.send(` ID: ${row.ID}, Nama Produk: ${row.NAMA_PRODUK}, Keterangan: ${row.KETERANGAN}, Harga: ${row.HARGA}, Jumlah: ${row.JUMLAH}`);
      console.log("Data berhasil ditampilkan");
    });
  });
});

app.get('/update/:id/:name', function(req,res){
    db.serialize(()=>{
      db.run('UPDATE produk SET nama_produk = ?, keterangan = ?, harga = ?, jumlah = ? WHERE id = ?', [req.params.nama_produk,req.params.keterangan,req.params.harga,req.params.jumlah,req.params.id], function(err){
        if(err){
          res.send("Terjadi kesalahan saat memperbaharui");
          return console.error(err.message);
        }
        res.send("Data berhasil diperbaharui");
        console.log("Data berhasil diperbaharui");
      });
    });
  });

  app.get('/del/:id', function(req,res){
    db.serialize(()=>{
      db.run('DELETE FROM produk WHERE id = ?', req.params.id, function(err) {
        if (err) {
          res.send("Terjadi kesalahan saat dihapus");
          return console.error(err.message);
        }
        res.send("Data berhasil dihapus");
        console.log("Data berhasil dihapus");
      });
    });});