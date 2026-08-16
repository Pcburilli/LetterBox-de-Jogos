from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Permite o Next.js acionar a API do Flask

# Simulando um banco de dados na memória por enquanto
produtos = [
    {"id": 1, "nome": "Teclado", "preco": 150.0},
    {"id": 2, "nome": "Mouse", "preco": 80.0}
]

@app.route('/produtos', methods=['GET'])
def get_produtos():
    return jsonify(produtos)

if __name__ == '__main__':
    app.run(debug=True, port=5000)