<header class="subhead">
  <img src="/img/terraformer-geostore.png" alt="terraformer geostore">
  <h2>GeoStore</h2>
  <h3><a href="/" class="button button-light">Get GeoStore</a></h3>
</header>

> GeoStore:<br />
> a lightweight API that allows you to store, index and query geographic data

GeoStore is a lightweight API that allows you to store, index and query geographic data with a variety of indexes and persistence methods. Each GeoStore consists of...

01. A "primary index" which is responsible for indexing and optimizing the geographic data in the store.

02. A "store" which is responsible for persisting data, either holding it in memory or persisting it to a backend database.

03. Any number of "secondary indexs" which index properties associted with your geographic data.


    // search for a point
    var envelope = {
      x: 101,
      y: 11,
      h: 0,
      w: 0
    };

    // should call the callback with results of [ { rowId: 23 } ]
    index.search(envelope, function (err, results) {
      // results [ { rowId: 23 } ]
    });

[GeoStore Documentation](/)