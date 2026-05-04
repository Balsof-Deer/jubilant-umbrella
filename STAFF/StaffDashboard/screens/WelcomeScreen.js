import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, Image, ActivityIndicator,
} from 'react-native';
import { API_BASE_URL } from '../constants/Api';
import { COLORS, RADIUS, SHADOW, COMMON_STYLES, useResponsive } from '../constants/Theme';

function LoginForm({ username, setUsername, password, setPassword, loading, error, handleLogin }) {
  return (
    <View style={styles.form}>
      <Text style={styles.formTitle}>Staff Login</Text>
      <Text style={styles.formSubtitle}>Sign in to access your department queue.</Text>

      <Text style={COMMON_STYLES.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Enter your username"
        placeholderTextColor={COLORS.subtleGray}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text style={COMMON_STYLES.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        placeholderTextColor={COLORS.subtleGray}
        secureTextEntry
      />

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.btnLogin, loading && styles.btnDisabled]}
        onPress={handleLogin}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading
          ? <ActivityIndicator color={COLORS.white} />
          : <Text style={styles.btnLoginText}>Login</Text>}
      </TouchableOpacity>
    </View>
  );
}

export default function WelcomeScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const { isMobile } = useResponsive();

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      setError('Please enter your username and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ username: username.trim(), password }),
      });
      const data = await response.json();
      if (!response.ok) { setError(data.error || 'Login failed.'); return; }
      navigation.navigate('Staff', {
        departmentID:   data.departmentID,
        departmentName: data.departmentName,
        staffUsername:  data.username,
      });
    } catch {
      setError('Could not connect to the server. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  const formProps = { username, setUsername, password, setPassword, loading, error, handleLogin };

  // ── Wide layout ──────────────────────────────────────────────────────────────
  if (!isMobile) {
    return (
      <View style={styles.wideRoot}>
        {/* Left branding panel */}
        <View style={styles.brandPanel}>
          <View style={styles.brandInner}>
            <Image source={require('../assets/UBotswana.png')} style={styles.brandLogo} resizeMode="contain" />
            <Text style={styles.brandTitle}>Staff Portal</Text>
            <Text style={styles.brandSub}>Queue Management System</Text>
            <View style={styles.brandDivider} />
            <Text style={styles.brandTagline}>
              Manage your department queue,{'\n'}serve students efficiently.
            </Text>

            <View style={styles.infoCards}>
              {[
                ['Live Queue', 'See who is waiting in real time'],
                ['Serve Users', 'Mark students as served instantly'],
                ['Manage Tasks', 'Control your service catalogue'],
              ].map(([title, desc]) => (
                <View key={title} style={styles.infoCard}>
                  <View>
                    <Text style={styles.infoTitle}>{title}</Text>
                    <Text style={styles.infoDesc}>{desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Right form panel */}
        <View style={styles.formPanel}>
          <View style={styles.formCard}>
            <LoginForm {...formProps} />
            <Text style={styles.footerText}>University of Botswana · Staff Only</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Landing')} style={styles.backLink}>
              <Text style={styles.backLinkText}>← Back to User Portal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // ── Mobile layout ─────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.mobileRoot}>
      <View style={styles.mobileCard}>
        <Image source={require('../assets/UBotswana.png')} style={styles.mobileLogo} resizeMode="contain" />
        <Text style={styles.mobilePortalTitle}>Staff Portal</Text>
        <Text style={styles.mobilePortalSub}>Queue Management System</Text>
        <LoginForm {...formProps} />
        <Text style={styles.footerText}>University of Botswana</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Landing')} style={styles.backLink}>
          <Text style={styles.backLinkText}>← Back to User Portal</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ── Wide ──────────────────────────────────────────────────────────────────
  wideRoot:   { flex: 1, flexDirection: 'row' },
  brandPanel: {
    width: '45%',
    backgroundColor: COLORS.primaryMaroon,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 56,
  },
  brandInner: { maxWidth: 400, width: '100%' },
  brandLogo:  { width: 88, height: 88, marginBottom: 28, tintColor: COLORS.white, opacity: 0.95 },
  brandTitle: { fontSize: 38, fontWeight: '800', color: COLORS.white, letterSpacing: -0.5, marginBottom: 6 },
  brandSub:   { fontSize: 16, color: 'rgba(255,255,255,0.6)', fontWeight: '500', marginBottom: 32 },
  brandDivider: { width: 40, height: 3, backgroundColor: COLORS.gold, borderRadius: 2, marginBottom: 24 },
  brandTagline: { fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 24, fontWeight: '400', marginBottom: 40 },
  infoCards:  { gap: 16 },
  infoCard:   { flexDirection: 'row', alignItems: 'flex-start', gap: 14, backgroundColor: 'rgba(255,255,255,0.08)', padding: 16, borderRadius: RADIUS.md },
  infoIcon:   { fontSize: 22, marginTop: 1 },
  infoTitle:  { fontSize: 14, fontWeight: '700', color: COLORS.white, marginBottom: 2 },
  infoDesc:   { fontSize: 12, color: 'rgba(255,255,255,0.6)' },

  formPanel: { flex: 1, backgroundColor: COLORS.surfaceGray, justifyContent: 'center', alignItems: 'center', padding: 56 },
  formCard:  {
    width: '100%', maxWidth: 440,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: 44,
    alignItems: 'stretch',
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    ...SHADOW.lg,
  },

  // ── Mobile ──────────────────────────────────────────────────────────────────
  mobileRoot: { flex: 1, backgroundColor: COLORS.primaryMaroon, justifyContent: 'center', padding: 20 },
  mobileCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.xl,
    padding: 32, alignItems: 'center', ...SHADOW.lg,
  },
  mobileLogo:       { width: 80, height: 80, marginBottom: 16 },
  mobilePortalTitle:{ fontSize: 24, fontWeight: '800', color: COLORS.darkGray, marginBottom: 4 },
  mobilePortalSub:  { fontSize: 14, color: COLORS.subtleGray, marginBottom: 28, fontWeight: '500' },

  // ── Shared form ─────────────────────────────────────────────────────────────
  form:       { width: '100%' },
  formTitle:  { fontSize: 26, fontWeight: '800', color: COLORS.darkGray, marginBottom: 6, letterSpacing: -0.4 },
  formSubtitle: { fontSize: 14, color: COLORS.subtleGray, marginBottom: 28, lineHeight: 21 },
  input: {
    ...COMMON_STYLES.input,
    marginBottom: 16,
  },
  errorBox: {
    backgroundColor: COLORS.errorLight,
    borderWidth: 1,
    borderColor: '#FECDCA',
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 18,
  },
  errorText: { color: COLORS.error, fontSize: 14, fontWeight: '600' },
  btnLogin: {
    ...COMMON_STYLES.btnPrimary,
    height: 52,
    marginTop: 4,
  },
  btnDisabled: { backgroundColor: COLORS.mediumGray, shadowOpacity: 0, elevation: 0 },
  btnLoginText: { ...COMMON_STYLES.btnText },
  footerText: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.subtleGray,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  backLink:     { marginTop: 16, alignItems: 'center' },
  backLinkText: { fontSize: 13, fontWeight: '600', color: COLORS.primaryMaroon },
});
