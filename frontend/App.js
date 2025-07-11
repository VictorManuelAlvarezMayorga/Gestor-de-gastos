import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { CreateExpenses } from './createExpenses';
import { ViewExpenses } from './viewExpenses';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>

      <Stack.Navigator initialRouteName="CreateExpenses">
        <Stack.Screen name="CreateExpenses" component={CreateExpenses} />
        <Stack.Screen name="viewExpenses" component={ViewExpenses} />
      </Stack.Navigator>
      
    </NavigationContainer>
  );
}