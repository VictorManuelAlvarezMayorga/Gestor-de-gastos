from app.models.expenses_model import Expense  
from app import db
from datetime import datetime as dt

def create_expense(category, description, amount):
    """Crea un nuevo gasto"""
    new_expense = Expense(
        category=category,
        description=description,
        amount=amount,
        created_at=dt.now()
    )
    db.session.add(new_expense)
    db.session.commit()
    return new_expense

def get_expenses():
    """Obtiene todos los gastos"""
    return Expense.query.all()

def update_expense(expense_id, updated_data):
    """Actualiza un gasto existente"""
    expense = Expense.query.get(expense_id)
    if not expense:
        return None
    
    for key, value in updated_data.items():
        setattr(expense, key, value)
    db.session.commit()
    return expense

def delete_expense(expense_id):
    """Elimina un gasto"""
    expense = Expense.query.get(expense_id)
    if not expense:
        return None
    
    db.session.delete(expense)
    db.session.commit()
    return expense