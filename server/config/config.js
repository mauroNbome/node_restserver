// ======================================
//  Puerto
// ======================================
//
process.env.PORT = process.env.PORT || 8080;

// ======================================
//  Entorno
// ======================================
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// ======================================
//  Database
// ======================================

let urlDB;

if (process.env.NODE_ENV === "dev") {
  urlDB = "mongodb://localhost:27017/cafe";
} else {
  urlDB =
    "mongodb+srv://fulleb:Uc8XRwpRJI0TMbxg@cluster0.6ayvx.mongodb.net/cafe";
}

process.env.URLDB = urlDB;
