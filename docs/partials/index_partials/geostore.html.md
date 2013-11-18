<header class="subhead">
  <img src="assets/images/terraformer-geostore.png" alt="terraformer geostore">
  <h2>GeoStore</h2>
  <h3>
    <a href="/geostore/" class="button button-light">Documentation</a>
    <a href="/install/#geostore" class="button button-light">Get GeoStore</a>
  </h3>
</header>

> A lightweight API that allows you to store, index and query geographic data.

GeoStore is a lightweight API that allows you to store, index and query geographic data with a variety of indexes and persistence methods. Each GeoStore consists of...

01. A _spatial index_ which is responsible for indexing and optimizing the geographic data in the store.

02. A _data store_ which is responsible for persisting data, either holding it in memory or persisting it to a backend database.

03. Any number of _secondary indexes_ which index properties associated with your geographic data.