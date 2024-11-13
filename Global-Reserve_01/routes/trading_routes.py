from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Order, Position, User
from services.market_data import get_stock_data  # Function to fetch live market data

trading_bp = Blueprint('trading', __name__)

@trading_bp.route('/order', methods=['POST'])
@jwt_required()
def place_order():
    user_id = get_jwt_identity()
    data = request.get_json()
    user = User.query.get(user_id)

    # Fetch live price
    price = get_stock_data(data['symbol'])
    if not price:
        return jsonify(message="Symbol not found"), 404

    order = Order(
        user_id=user.id,
        symbol=data['symbol'],
        quantity=data['quantity'],
        price=price,
        demo=data.get('demo', True)
    )

    # Deduct balance if real trade
    if not order.demo:
        user.real_balance -= price * order.quantity
    else:
        user.demo_balance -= price * order.quantity

    db.session.add(order)
    db.session.commit()
    return jsonify(message="Order placed successfully"), 201
