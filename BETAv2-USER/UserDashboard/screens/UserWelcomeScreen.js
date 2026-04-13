import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { COLORS, COMMON_STYLES } from '../constants/Theme';

export default function UserWelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Image 
          source={require('../assets/UBotswana.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>UNIVERSITY OF BOTSWANA</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Queue Management System</Text>
          
          <View style={styles.options}>
            <TouchableOpacity 
              style={styles.btnPrimary} 
              onPress={() => navigation.navigate('Join')}
              activeOpacity={0.8}
            >
              <Text style={styles.btnText}>Join the Queue</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.btnSecondary} 
              onPress={() => navigation.navigate('Status')}
              activeOpacity={0.8}
            >
              <Text style={styles.btnSecondaryText}>Check Queue Status</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerText}>"Inspiring the Future"</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingVertical: 40,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.mediumGray,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  headerTitle: {
    color: COLORS.primaryMaroon,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 2,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    ...COMMON_STYLES.card,
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.darkGray,
    marginBottom: 48,
    textAlign: 'center',
    lineHeight: 32,
  },
  options: {
    width: '100%',
  },
  btnPrimary: {
    ...COMMON_STYLES.btnPrimary,
    marginBottom: 16,
    height: 56,
  },
  btnSecondary: {
    backgroundColor: COLORS.white,
    height: 56,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primaryMaroon,
    marginBottom: 16,
  },
  btnText: {
    ...COMMON_STYLES.btnText,
  },
  btnSecondaryText: {
    color: COLORS.primaryMaroon,
    fontSize: 16,
    fontWeight: '700',
  },
  footerText: {
    marginTop: 24,
    color: COLORS.mediumGray,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});