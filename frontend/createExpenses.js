import { useState } from 'react';
import { Pressable, Text, TextInput, View, StyleSheet, ScrollView, Alert } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

const API_URL = "http://localhost:5000/api";

export const CreateExpenses = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    category: '',
    description: '',
    amount: '',
    date: new Date()
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); 

  //manejador de cambios genérico
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
//'' '' fecha
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      handleChange('date', selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return; //evita múltiples envíos
    
    const { category, description, amount, date } = formData;
    
    // Validaciones
    if (!category || !description || !amount) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    if (isNaN(amount)) {
      Alert.alert('Error', 'El monto debe ser un número');
      return;
    }

    setIsSubmitting(true); 

    try {
      const response = await fetch(`${API_URL}/create`, { 
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          description,
          amount: parseFloat(amount),
          created_at: date.toISOString().split('T')[0] //formato YYYY-MM-DD
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar el gasto');
      }

      Alert.alert('Éxito', 'Gasto registrado correctamente');
      
      //resetear formulario
      setFormData({
        category: '',
        description: '',
        amount: '',
        date: new Date()
      });
      
    } catch (error) {
      console.error('Error al crear gasto:', error);
      Alert.alert('Error', error.message || 'Ocurrió un error al registrar el gasto');
    } finally {
      setIsSubmitting(false); //finaliza el envío
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Nuevo Gasto</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tipo de gasto</Text>
            <TextInput 
              style={styles.textInput} 
              placeholder="Servicios, comida, gusto, transporte, etc."
              placeholderTextColor="#a0a0a0"
              value={formData.category}
              onChangeText={(text) => handleChange('category', text)}
            />
          </View>

          {/* Campo: Descripción */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Descripción</Text>
            <TextInput 
              style={styles.textInput} 
              placeholder="Detalle del gasto"
              placeholderTextColor="#a0a0a0"
              value={formData.description}
              onChangeText={(text) => handleChange('description', text)}
            />
          </View>

          {/* Campo: Monto */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Monto del gasto</Text>
            <TextInput 
              style={styles.textInput} 
              placeholder="0.00"
              placeholderTextColor="#a0a0a0"
              keyboardType="numeric"
              value={formData.amount}
              onChangeText={(text) => handleChange('amount', text)}
            />
          </View>

          {/* Campo: Fecha */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Fecha</Text>
            <Pressable 
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>{formData.date.toLocaleDateString()}</Text>
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={formData.date}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

          <View style={styles.buttonsContainer}>
            <Pressable 
              style={[styles.button, styles.saveButton, isSubmitting && styles.disabledButton]} 
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? 'Registrando...' : 'Registrar gasto'}
              </Text>
            </Pressable>

            <Pressable 
              style={[styles.button, styles.viewButton]}
              onPress={() => navigation.navigate("viewExpenses")}
            >
              <Text style={styles.buttonText}>Ver todos mis gastos</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#041527ff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#363636ff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#bddeffff',
    marginBottom: 24,
    textAlign: 'center'
  },
  inputGroup: {
    marginBottom: 20
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#bddeffff',
    marginBottom: 8,
    textAlign: 'center'
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#2d3436',
    backgroundColor: '#f5f6fa'
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#f5f6fa',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#2d3436',
  },
  buttonsContainer: {
    marginTop: 10
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12
  },
  saveButton: {
    backgroundColor: '#ecae2aff',
  },
  viewButton: {
    backgroundColor: '#d20e0eff',
  },
  disabledButton: {
    backgroundColor: '#cccccc', // Color cuando está deshabilitado
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});