from requests_html import HTMLSession

product_url = "https://topodesigns.com/collections/backpacks/products/rover-pack-classic?variant=33191946944565"

if HTMLSession().get(product_url).html.find('p#out-of-stock-gl'):
    print("UNAVAILABLE")
else:
    print("AVAILABLE")
