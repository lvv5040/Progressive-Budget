

//at the global scope create db
var db;

//set up request for budget document
var request = indexedDB.open("budget", 1);

//on upgrade request check version and change update status if version differ
request.onupgradeneeded = function (event) {
  event.target.result.createObjectStore("pending", { autoIncrement: true });
};

//when sucess status is changes search db
request.onsuccess = function (event) {
  //check if app is connected to the internet
  if (navigator.onLine) {
    //get all pending transactions and then transaction from objectStore
    var storage = event.target.result
      .transaction(["pending"], "readwrite")
      .objectStore("pending")
      .getAll();
    //set store onsucess
    storage.onsuccess = function () {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(() => {
          event.target.result
            .transaction(["pending"], "readwrite")
            .objectStore("pending")
            .clear();
        });
    };
  }
};

//when error do this
request.onerror = function (event) {
  console.log("Look up Error Code: ", event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");
  store.add(record);
}

//when lack online listener
window.addEventListener("online", function (event) {
  //get all pending transactions and then transaction from objectStore
  var storage = event.target.result
    .transaction(["pending"], "readwrite")
    .objectStore("pending")
    .getAll();
  //set store onsucess
  storage.onsuccess = function () {
    fetch("/api/transaction/bulk", {
      method: "POST",
      body: JSON.stringify(getAll.result),
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(() => {
        event.target.result
          .transaction(["pending"], "readwrite")
          .objectStore("pending")
          .clear();
      });
  };
});
// listen for app coming back online
window.addEventListener("online", checkDatabase);