from app import db
from datetime import datetime as dt

class Expense(db.Model):

    __tablename__ = 'expenses'

    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    created_at = db.Column(db.DateTime, default=dt.now)  
    
    def to_dict(self):
        return {
            'id': self.id,
            'category': self.category,
            'description': self.description,
            'amount': float(self.amount),  
            'created_at': self.created_at.isoformat()
        }