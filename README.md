# peek

![Screenshot of peek](https://i.imgur.com/egsi0Qc.png)

peek is a minimal landing page for your servers that can optionally act as a
miniature dashboard.

To get started, clone the website somewhere:

```sh
git clone https://github.com/slice/peek.git
```

Then, edit `index.html` and replace the `<h1>` text with the name of your server
or network. If you just want a static landing page, then you're done!

## Dashboard usage

You can optionally expose a JSON endpoint (or file) that the website can fetch
to present a list of meters, links, or both. We'll call this the dashboard.

By default, the website is static and fully functional with JavaScript disabled.
To enable the dashboard, change `DYNAMIC` from `false` to `true` in the
`<script>` tag in `index.html`:

```js
window.DYNAMIC = true;
window.DYNAMIC_JSON_ENDPOINT = "//dynamic.example.json";
```

`DYNAMIC_JSON_ENDPOINT` is the URL to the JSON that the website will fetch on
load. If you want to load JSON from a different domain, make sure that you have
[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) configured
correctly.

(If the endpoint starts with `//`, then the `//` will be replaced with the
domain that the page is loaded at, even matching the protocol.)

### Example

Here is a commentated example of the JSON the server can respond with. Keep in
mind that JSON doesn't actually support comments, so you'll need to remove them
if you copy this.

```js
{
  // The link list. You can remove this entirely if you'd like.
  "links": [
    // A plain link.
    { "url": "https://github.com" },
    // A link with custom text.
    { "url": "https://gitlab.com", "text": "GitLab" },
    // A link with custom text that opens in a new tab.
    { "url": "https://grafana.com", "text": "Grafana", "new_tab": true }
  ],

  // The meter display. Again, you can remove this entirely if you'd like.
  "meters": [
    // A meter. The minimum value is zero (this cannot be changed).
    { "value": 25, "max": 50, "label": "Apples" },
    // A meter with a unit.
    { "value": 250, "max": 1000, "label": "Storage", "unit": "GB" },
    // A meter that omits the maximum value. You can also hide the value
    // altogether with `"showValue": false`.
    { "value": 75, "label": "Bandwidth", "unit": "TB", "showMax": false }
  ]
}
```
