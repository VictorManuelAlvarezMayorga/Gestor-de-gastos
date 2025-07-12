from flask import Blueprint, request, jsonify
from app.controllers.expenses_controller import (
    create_expense, 
    get_expenses, 
    update_expense, 
    delete_expense
)
from datetime import datetime as dt

expense_bp = Blueprint("expense", __name__, url_prefix="/api")

@expense_bp.route("/create", methods=["POST"])
def create_expense_route():
    data = request.get_json()
    
    #validación
    required_fields = ['category', 'description', 'amount']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Faltan campos requeridos'}), 400
        
    try:
        amount = float(data['amount'])
    except ValueError:
        return jsonify({'error': 'El monto debe ser numérico'}), 400
    
    #creación
    expense = create_expense(
        category=data['category'],
        description=data['description'],
        amount=amount
    )
    
    return jsonify({
        'message': 'Gasto creado exitosamente',
        'expense': expense.to_dict()
    }), 200

@expense_bp.route("/get", methods=["GET"])
def get_expenses_route():
    expenses = get_expenses()
    return jsonify({
        'expenses': [expense.to_dict() for expense in expenses]
    })

@expense_bp.route("/update/<int:expense_id>", methods=["PUT"])
def update_expense_route(expense_id):
    data = request.get_json()
    
    try:
        if 'amount' in data:
            data['amount'] = float(data['amount'])
    except ValueError:
        return jsonify({'error': 'Monto inválido'}), 400
    
    updated_expense = update_expense(expense_id, data)
    if not updated_expense:
        return jsonify({'error': 'Gasto no encontrado'}), 404
        
    return jsonify({
        'message': 'Gasto actualizado',
        'expense': updated_expense.to_dict()
    })

@expense_bp.route("/delete/<int:expense_id>", methods=["DELETE"])
def delete_expense_route(expense_id):
    deleted_expense = delete_expense(expense_id)
    if not deleted_expense:
        return jsonify({'error': 'Gasto no encontrado'}), 404
        
    return jsonify({
        'message': 'Gasto eliminado',
        'expense': deleted_expense.to_dict()
    })