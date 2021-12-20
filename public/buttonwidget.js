
let widgetScript = document.querySelector('script[data-name="crypto-coffee-button"]');

var s = document.getElementsByTagName('script')[0];

const buttonEventScript = document.createElement('script');
buttonEventScript.defer = true;
buttonEventScript.src='https://static.cloudflareinsights.com/beacon.min.js';
buttonEventScript.dataset.cfBeacon = '{"token": "31fafc582c564dca9461cd9a1e3b6f4f"}'

s.parentNode.insertBefore(buttonEventScript, s);

window.cryptoCoffeeWidget = window.cryptoCoffeeWidget || function(
    // text,
    address,
    color,
    emoji,
    font,
    font_color,
    outline_color,
    coffee_color
) {
    const widget = '<div class="crypto-coffee-btn-container"><a class="crypto-coffee-btn" ' + `target="_blank" href="http://buymeacryptocoffee.xyz/${address}">` + "<img src='https://www.buymeacryptocoffee.xyz/embedbadge.svg'/>" + "</a></div>"
    return widget;
}

widgetScript && document.writeln(
    cryptoCoffeeWidget(
        widgetScript.attributes['data-address'].value
    )
)