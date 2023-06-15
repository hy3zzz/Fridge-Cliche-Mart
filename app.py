from flask import Flask, render_template, request, jsonify, session
from flask import after_this_request
from flask import Response
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
from flask import send_from_directory

app = Flask(__name__)
app.secret_key = 'abcdefg'

cart=[]

@app.route("/", methods=["GET"])
def catalog():
    return render_template("catalog.html")

@app.route("/loading")
def loading():
    try:
        return render_template("loading.html")
    except Exception as e:
        return str(e), 500
    
@app.route("/fridge")
def fridge():
    try:
        return render_template("fridge.html")
    except Exception as e:
        return str(e), 500

@app.route('/get-image-names', methods=['GET'])
def get_image_names():
    image_folder = 'static/img'
    image_files = os.listdir(image_folder)
    return jsonify(image_files)

@app.route("/get-cart", methods=["GET"])
def get_cart():
    cart = session.get('cart', [])
    return jsonify(cart)

@app.route("/add-to-cart", methods=["POST"])
def add_to_cart():
    item_name = request.form.get("item_name")
    item_image = request.form.get("item_image")
    item_detail = request.form.get("item_detail")

    if 'cart' not in session:
        session['cart'] = []

    # Check if item already exists in cart
    for item in session['cart']:
        if item['name'] == item_name:
            # Return the current cart state instead of an error
            return jsonify(session['cart'])

    # Add item to cart
    item = {
        "name": item_name,
        "image": item_image,
        "detail": item_detail,
    }
    session['cart'].append(item)
    session.modified = True

    # 데이터를 콘솔에 출력
    print("Item added to cart:", item)

    return jsonify(session['cart'])


@app.route("/remove-from-cart", methods=["POST"])
def remove_from_cart():
    item_name = request.form.get("item_name")

    if 'cart' not in session:
        session['cart'] = []

    # Remove the item from the cart if it exists
    session['cart'] = [item for item in session['cart'] if item['name'] != item_name]
    session.modified = True

    # 데이터를 콘솔에 출력
    print("Item removed from cart:", item_name)

    return jsonify(session['cart'])


def create_receipt(items, total):
    # Load the font for the receipt text
    font = ImageFont.truetype("Arial.ttf", 20)
    font_bold = ImageFont.truetype("Arial_Bold.ttf", 20)

    # Calculate the required height for the receipt image based on the number of items
    receipt_height = 150 + len(items) * 30

    # Create a new image for the receipt
    image = Image.new("RGB", (300, receipt_height), "white")
    draw = ImageDraw.Draw(image)

    # Add a dashed separator line
    def draw_dashed_line(y):
        for x in range(10, 290, 20):
            draw.line([(x, y), (x + 10, y)], fill="black", width=1)

    # Add the header text
    draw.text((90, 10), "Your Shop", font=font_bold, fill="black")
    draw.text((50, 40), "123 Main St, Anytown", font=font, fill="black")
    draw.text((75, 70), "Phone: (555) 123-4567", font=font, fill="black")
    draw_dashed_line(100)

    # Add the items and prices
    y = 110
    for item, price in items:
        draw.text((10, y), item, font=font, fill="black")
        draw.text((240, y), f"${price:.2f}", font=font, fill="black")
        y += 30

    draw_dashed_line(y)
    y += 20

    # Add the total price
    draw.text((10, y), "Total", font=font_bold, fill="black")
    draw.text((240, y), f"${total:.2f}", font=font_bold, fill="black")

    return image

import os
import tempfile

@app.route("/download", methods=["POST"])
def download_receipt():
    items = [
        ("Item 1", 12.99),
        ("Item 2", 25.00),
        ("Item 3", 8.50)
    ]
    total = sum(price for _, price in items)
    receipt_image = create_receipt(items, total)

    img_io = BytesIO()
    receipt_image.save(img_io, "PNG")
    img_io.seek(0)

    response = Response(img_io.getvalue(), content_type="image/png")
    response.headers.set("Content-Disposition", "attachment", filename="receipt.png")

    return response

if __name__ == "__main__":
    app.run(debug=True, port=4000)