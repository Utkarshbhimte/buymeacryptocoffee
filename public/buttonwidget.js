const gtag_id = "G-4HENSLHDZS";
let widgetScript = document.querySelector('script[data-name="crypto-coffee-button"]');

const ga = document.createElement('script');
ga.type = 'text/javascript'; 
ga.async = true;
ga.src = `https://www.googletagmanager.com/gtag/js?id=${gtag_id}`;
var s = document.getElementsByTagName('script')[0]; 
s.parentNode.insertBefore(ga, s);

const buttonEventScript = document.createElement('script');

buttonEventScript.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', gtag_id, { 'send_page_view': false });

    gtag('event', 'button_embedded', {
        event_label: widgetScript.attributes['data-address'].value
    })
    console.log(widgetScript.attributes['data-address'].value)
`

var p = document.getElementsByTagName('script')[1]; 
p.parentNode.insertBefore(buttonEventScript, p);

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