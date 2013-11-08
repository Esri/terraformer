<header class="subhead">
  <img src="assets/images/terraformer-core.png" alt="terraformer core">
  <h2>Terraformer Core</h2>
  <h3><a href="/" class="button button-light">Get Core</a></h3>
</header>

#### Primitives

The Terraformer Primitives are classes that map directly to their GeoJSON equivalents, adding convenience methods, geometric tools such as `within`, and `intersects` and spatial reference conversion methods.
`Terraformer.Primitive` is the base class for all primitives.  As such, it can perform most actions that every other primitive can.  All other primitives inherit from `Terraformer.Primitive`, and thus all methods on `Terraformer.Primitive` are available on those primitives.

When a `GeoJSON` object is passed in at instantiation, it will create an `object` of that type of `GeoJSON`.


[Terraformer Core Documentation](/documentation/core)