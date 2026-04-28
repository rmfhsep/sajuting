import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import SplashScreen from './src/screens/Auth/SplashScreen';
import LoginScreen from './src/screens/Auth/LoginScreen';
import RegisterScreen from './src/screens/Auth/RegisterScreen';
import HomeScreen from './src/screens/Home/HomeScreen';
import SajuInputScreen from './src/screens/Saju/SajuInputScreen';
import SajuResultScreen from './src/screens/Saju/SajuResultScreen';
import GwansangInputScreen from './src/screens/Gwansang/GwansangInputScreen';
import GwansangResultScreen from './src/screens/Gwansang/GwansangResultScreen';
import MyPageScreen from './src/screens/MyPage/MyPageScreen';
import { Colors } from './src/constants/theme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
        },
        tabBarActiveTintColor: Colors.purple,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>☯</Text>,
        }}
      />
      <Tab.Screen
        name="SajuInput"
        component={SajuInputScreen}
        options={{
          tabBarLabel: '사주',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🔮</Text>,
        }}
      />
      <Tab.Screen
        name="GwansangInput"
        component={GwansangInputScreen}
        options={{
          tabBarLabel: '관상',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>👁</Text>,
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{
          tabBarLabel: '마이',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>📜</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor={Colors.background} />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: Colors.background },
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="SajuResult" component={SajuResultScreen} />
          <Stack.Screen name="GwansangResult" component={GwansangResultScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
