import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';

const API_URL = "//conexion";

export const ViewExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [form, setForm] = useState({
    category: '',
    description: '',
    amount: '',
    created_at: ''
  });

  useEffect(() => {
    loadExpenses();
  }, []);

  const getCurrentMonthTotal = () => {
    const now = new Date();
    return expenses
      .filter(expense => {
        const expenseDate = new Date(expense.created_at);
        return (
          expenseDate.getMonth() === now.getMonth() && 
          expenseDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  };

  const loadExpenses = async () => {
    try {
      const response = await fetch('${API_URL}//getExpenses conection');
      const { expenditures } = await response.json();
      setExpenses(expenditures);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los gastos");
    }
  };

  const deleteExpense = async (id) => {
    try {
      const response = await fetch(`${API_URL}/delete/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        Alert.alert("Éxito", "Gasto eliminado");
        loadExpenses();
      }
    } catch (error) {
      Alert.alert("Error");
    }
  };

  const updateExpense = async () => {
    if (!form.category || !form.description || !form.amount || !form.created_at) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/update/${expense.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          amount: parseFloat(form.amount),
          created_at: `${form.created_at}T00:00:00Z`
        })
      });

      if (response.ok) {
        Alert.alert("Éxito", "Gasto actualizado");
        setIsModalVisible(false);
        loadExpenses();
      }
    } catch (error) {
      Alert.alert("Error");
    }
  };

  const openEditForm = (expense) => {
    setCurrentExpense(expense);
    setForm({
      category: expense.category,
      description: expense.description,
      amount: expense.amount.toString(),
      created_at: expense.created_at.split('T')[0]
    });
    setIsModalVisible(true);
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const ExpenseCard = ({ expense }) => (
    <View>
      <Text>{expense.category}</Text>
      <Text>{expense.description}</Text>
      <Text>Monto: {expense.amount}</Text>
      <Text>Fecha: {expense.created_at.split('T')[0]}</Text>
      
      <View>
        <TouchableOpacity onPress={() => openEditForm(expense)}>
          <Text>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => deleteExpense(expense.id)}>
          <Text>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const EditModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View>
        <View>
          <Text>Editar Gasto</Text>
          
          <Text>Categoria:</Text>
          <TextInput
            value={form.category}
            onChangeText={(text) => handleInputChange('category', text)}
          />
          
          <Text>Descripcion:</Text>
          <TextInput
            value={form.description}
            onChangeText={(text) => handleInputChange('description', text)}
          />
          
          <Text>Monto:</Text>
          <TextInput
            value={form.amount}
            onChangeText={(text) => handleInputChange('amount', text)}
            keyboardType="numeric"
          />
          
          <Text>Fecha:</Text>
          <TextInput
            value={form.created_at}
            onChangeText={(text) => handleInputChange('created_at', text)}
          />
          
          <View>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Text>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={//updateExpense conexion}>
              <Text>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View>
      <View>
        <Text>Total este mes:</Text>
        <Text>${getCurrentMonthTotal()}</Text>
      </View>

      <ScrollView>
        {expenses.map(expense => (
          <ExpenseCard key={expense.id} expense={expense} />
        ))}
      </ScrollView>

      <EditModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#041527ff',
    padding: 16,
  },
  totalContainer: {
    backgroundColor: '#363636ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#bddeffff',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ecae2aff',
  },
  card: {
    backgroundColor: '#363636ff',
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  category: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#bddeffff',
    marginBottom: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    marginLeft: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#ecae2aff',
  },
  deleteButton: {
    backgroundColor: '#d20e0eff',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    backgroundColor: '#363636ff',
    padding: 24,
    borderRadius: 12,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#bddeffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    marginTop: 12,
    marginBottom: 8,
    fontWeight: '600',
    color: '#bddeffff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#5a5a5aff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
    color: '#ffffff',
    backgroundColor: '#2a2a2aff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  modalButton: {
    padding: 14,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#5a5a5aff',
  },
  saveButton: {
    backgroundColor: '#ecae2aff',
  },
});