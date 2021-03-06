
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
    const widget = '<div class="crypto-coffee-btn-container"><a class="crypto-coffee-btn" style="border:none;background:none;padding:0;margin:0;" ' + `target="_blank" href="http://buymeacryptocoffee.xyz/${address}?ref=button_widget">` + "<img src='https://www.buymeacryptocoffee.xyz/embedbadge.svg'/>" + "</a></div>"
    return widget;
}

widgetScript && document.writeln(
    cryptoCoffeeWidget(
        widgetScript.attributes['data-address'].value
    )
)