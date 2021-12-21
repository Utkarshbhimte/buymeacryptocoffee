
let widgetScript = document.querySelector('script[data-name="crypto-coffee-button"]');

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
    const widget = '<div class="crypto-coffee-btn-container"><a class="crypto-coffee-btn" ' + `target="_blank" href="http://buymeacryptocoffee.xyz/${address}?ref=button_widget">` + "<img src='https://www.buymeacryptocoffee.xyz/embedbadge.svg'/>" + "</a></div>"
    return widget;
}

widgetScript && document.writeln(
    cryptoCoffeeWidget(
        widgetScript.attributes['data-address'].value
    )
)