const q = document.querySelector.bind(document);

function h(tag, attributes = null, ...inner) {
  const elem = document.createElement(tag);
  if (attributes != null && attributes.length !== 0) {
    for (const [key, value] of Object.entries(attributes)) {
      if (value == null) {
        continue;
      }
      elem.setAttribute(key, value);
    }
  }
  for (const node of inner) {
    if (typeof node === "string") {
      elem.innerText = node;
      break;
    }
    elem.appendChild(node);
  }
  return elem;
}

async function fetchDynamicJSON(endpoint = DYNAMIC_JSON_ENDPOINT) {
  if (endpoint.startsWith("//")) {
    endpoint = `${window.location.origin}/${endpoint.slice(2)}`;
  }

  let resp;
  try {
    resp = await fetch(endpoint);

    if (!resp.ok) {
      throw `Failed to fetch dashboard JSON: server responded with HTTP ${resp.status}.`;
    }
  } catch (error) {
    throw `Failed to load dashboard JSON: ${error}`;
  }

  let object;
  try {
    object = await resp.json();
  } catch (error) {
    throw `Failed to parse dashboard JSON: ${error}`;
  }
  return object;
}

async function setupDynamicElements() {
  const object = await fetchDynamicJSON();
  let content = h("div", { class: "content" });

  if (object.links != null) {
    let links = h("ul");
    for (const { url, text = url, new_tab = false } of object.links) {
      let attribs = { href: url };
      if (new_tab) {
        attribs._target = "blank";
      }
      links.appendChild(h("li", null, h("a", attribs, text)));
    }
    content.appendChild(links);
  }

  if (object.meters != null) {
    let meters = h("div", { class: "meters" });
    for (const [
      index,
      {
        max = 100,
        value = 50,
        unit = "",
        label = "Meter",
        showValue = true,
        showMax = true,
      },
    ] of object.meters.entries()) {
      const id = `generated-meter-${index}`;
      const percentage = (value / max) * 100;
      let fullLabel = showValue
        ? `${label} (${value}${showMax ? `/${max}` : ""}${
            unit === "" ? "" : ` ${unit}`
          })`
        : label;
      let meter = h(
        "div",
        { class: "meter-container" },
        h(
          "div",
          { class: "meter" },
          h("div", { class: "meter-value", style: `width: ${percentage}%` })
        ),
        h("label", { for: id }, fullLabel)
      );
      meters.appendChild(meter);
    }
    content.appendChild(meters);
  }

  q("main").appendChild(content);
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add(DYNAMIC ? "dynamic" : "static");

  if (DYNAMIC) {
    setupDynamicElements().catch(console.error);
  }
});
