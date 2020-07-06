# peek

peek is an optionally dynamic mini-dashboard website for your servers.

## Dynamic JSON

You can expose a JSON endpoint that the website can fetch to present a link
list, a meter display, or both.

By default, the website is static. To enable dynamic JSON, edit `index.html`:

```js
window.DYNAMIC = true;
window.DYNAMIC_JSON_ENDPOINT = "//dynamic.example.json";
```

`DYNAMIC_JSON_ENDPOINT` dictates the URL the website will `fetch`. Make sure
that you have [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
configured correctly if you'll have the website request something that isn't on
the same origin (i.e. domain).

If the endpoint starts with `//`, then the `//` will be replaced with the domain
that the page is loaded at, even matching the protocol.

### Example

Here is a commentated example of the JSON you can return. Keep in mind that JSON
doesn't actually support comments.

```js
{
  // Link list. You can remove this entirely if you'd like.
  "links": [
    // A plain link.
    { "url": "https://github.com" },
    // A link with custom text.
    { "url": "https://gitlab.com", "text": "GitLab" },
    // A link with custom text that opens in a new tab.
    { "url": "https://grafana.com", "text": "Grafana", "new_tab": true }
  ],

  // Meter display. Again, you can remove this entirely if you'd like.
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
