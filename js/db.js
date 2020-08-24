const dbPromised = idb.open("serieA", 1, function (upgradeDb) {
  const clubObjectStore = upgradeDb.createObjectStore("club", {
    keyPath: "id",
  });
  clubObjectStore.createIndex("serieA_club", "serieA_club", {
    unique: false,
  });
});

function clubCheck(id) {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        let tx = db.transaction("club", "readonly");
        let store = tx.objectStore("club");
        return store.get(id);
      })
      .then(function (data) {
        if (data !== undefined) {
          resolve("favorit");
        } else {
          reject("bukan favorit");
        }
      });
  });
}

function clubSave(club) {
  dbPromised
    .then(function (db) {
      let tx = db.transaction("club", "readwrite");
      let store = tx.objectStore("club");
      store.put(club);
      console.log(club);
      return tx.complete;
    })
    .then(function () {
      console.log("club berhasil di simpan.");
      document.getElementById("iconFav").innerHTML = "favorite";
      M.toast({
        html: "Teams Added to Favorite",
      });
    })
    .catch(function () {
      M.toast({
        html: "error",
      });
    });
}

function getAll() {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        let tx = db.transaction("club", "readonly");
        let store = tx.objectStore("club");
        return store.getAll();
      })
      .then(function (club) {
        resolve(club);
        console.log("tidak ada klub yang ditambahkan");
      });
  });
}

function byId(id) {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        let tx = db.transaction("club", "readonly");
        let store = tx.objectStore("club");
        console.log(store);
        return store.get(id);
      })
      .then(function (club) {
        resolve(club);
      });
  });
}

function deleteClub(id) {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        let tx = db.transaction("club", "readwrite");
        let del = tx.objectStore("club");
        console.log(id);
        del.delete(id);
        return tx.complete;
      })
      .then(function (id) {
        resolve(id);
        console.log("club berhasil dihapus ");
        document.getElementById("iconFav").innerHTML = "favorite_border";
        M.toast({
          html: "Teams has been remove from favorite",
        });
      })
      .catch(function () {
        M.toast({
          html: "error",
        });
      });
  });
}
