from flask import Flask, render_template, jsonify
from edge_processor import EdgeProcessor
import threading
import time

app = Flask(__name__)

edge = EdgeProcessor()

# Background simulator thread
def loop():
    while True:
        edge.predict()
        time.sleep(1)

threading.Thread(target=loop, daemon=True).start()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api")
def api():
    return jsonify({
        "latest": edge.get_latest(),
        "history": edge.get_history()
    })

app.run(debug=True)
