from requests_html import HTMLSession

product_url = "https://topodesigns.com/collections/backpacks/products/rover-pack-classic?variant=33191946944565"


def check_availability():
    session = HTMLSession()
    r = session.get(product_url)

    is_out_of_stock = r.html.find('p#out-of-stock-gl')

    if is_out_of_stock:
        print("UNAVAILABLE")
    else:
        print("AVAILABLE")
    return


check_availability()
