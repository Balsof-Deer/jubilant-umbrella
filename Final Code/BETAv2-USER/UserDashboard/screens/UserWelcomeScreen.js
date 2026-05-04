import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, Platform, useWindowDimensions } from 'react-native';
import { COLORS, RADIUS, SHADOW, COMMON_STYLES, useResponsive } from '../constants/Theme';

export default function UserWelcomeScreen({ navigation }) {
  const { isMobile } = useResponsive();
  const { width } = useWindowDimensions();

  // Split-panel on large screens, centered card on mobile
  if (!isMobile) {
    return (
      <View style={styles.wideRoot}>
        {/* Left branding panel */}
        <View style={styles.brandPanel}>
          <View style={styles.brandInner}>
            <View style={styles.logoBubble}>
              <Image source={require('../assets/UBotswana.png')} style={styles.brandLogo} resizeMode="contain" />
            </View>
            <Text style={styles.brandTitle}>Queue Management{'\n'}System</Text>
            <Text style={styles.brandTagline}>University of Botswana</Text>
            <View style={styles.brandDivider} />
            <View style={styles.featureList}>
              {[
                ['⏱', 'Skip the physical queue'],
                ['📍', 'Track your position live'],
                ['📋', 'Know your required documents'],
              ].map(([icon, text]) => (
                <View key={text} style={styles.featureRow}>
                  <Text style={styles.featureIcon}>{icon}</Text>
                  <Text style={styles.featureText}>{text}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Right action panel */}
        <View style={styles.actionPanel}>
          <View style={styles.actionInner}>
            <Text style={styles.actionTitle}>Welcome</Text>
            <Text style={styles.actionSubtitle}>
              Join a service queue or check your current position.
            </Text>

            <TouchableOpacity style={styles.btnPrimaryWide} onPress={() => navigation.navigate('Join')} activeOpacity={0.85}>
              <Text style={styles.btnPrimaryText}>Join the Queue</Text>
              <Text style={styles.btnArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnSecondaryWide} onPress={() => navigation.navigate('Status')} activeOpacity={0.85}>
              <Text style={styles.btnSecondaryText}>Check Queue Status</Text>
              <Text style={styles.btnArrowSecondary}>→</Text>
            </TouchableOpacity>

            <View style={styles.helpRow}>
              <Text style={styles.helpText}>Need help? Contact your department desk.</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // ── Mobile layout ────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.mobileRoot}>
      <View style={styles.mobileCard}>
        <Image source={require('../assets/UBotswana.png')} style={styles.mobileLogo} resizeMode="contain" />
        <Text style={styles.mobileTitle}>Queue Management System</Text>
        <Text style={styles.mobileSubtitle}>University of Botswana</Text>

        <View style={styles.mobileActions}>
          <TouchableOpacity style={styles.btnPrimaryMobile} onPress={() => navigation.navigate('Join')} activeOpacity={0.85}>
            <Text style={styles.btnPrimaryText}>Join the Queue</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSecondaryMobile} onPress={() => navigation.navigate('Status')} activeOpacity={0.85}>
            <Text style={styles.btnSecondaryText}>Check Queue Status</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.mobileFooter}>Skip the line — join digitally</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ── Wide layout ─────────────────────────────────────────────────────────────
  wideRoot: {
    flex: 1,
    flexDirection: 'row',
  },
  brandPanel: {
    width: '42%',
    backgroundColor: COLORS.primaryMaroon,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  brandInner: {
    maxWidth: 380,
    width: '100%',
    alignItems: 'flex-start',
  },
  brandLogo: {
    width: 100,
    height: 100,
    marginBottom: 32,
    opacity: 0.95,
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.white,
    lineHeight: 44,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  brandTagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '500',
    letterSpacing: 0.5,
    marginBottom: 40,
  },
  brandDivider: {
    width: 48,
    height: 3,
    backgroundColor: COLORS.gold,
    borderRadius: 2,
    marginBottom: 32,
  },
  featureList: { gap: 16 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  featureIcon: { fontSize: 20 },
  featureText: { fontSize: 15, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },

  actionPanel: {
    flex: 1,
    backgroundColor: COLORS.surfaceGray,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 64,
  },
  actionInner: {
    width: '100%',
    maxWidth: 420,
  },
  actionTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: COLORS.darkGray,
    letterSpacing: -1,
    marginBottom: 10,
  },
  actionSubtitle: {
    fontSize: 16,
    color: COLORS.subtleGray,
    fontWeight: '400',
    lineHeight: 24,
    marginBottom: 48,
  },
  btnPrimaryWide: {
    backgroundColor: COLORS.primaryMaroon,
    borderRadius: RADIUS.lg,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 16,
    ...SHADOW.md,
  },
  btnSecondaryWide: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    borderWidth: 1.5,
    borderColor: COLORS.borderGray,
    marginBottom: 40,
    ...SHADOW.sm,
  },
  btnPrimaryText: { fontSize: 16, fontWeight: '700', color: COLORS.white },
  btnSecondaryText: { fontSize: 16, fontWeight: '700', color: COLORS.darkGray },
  btnArrow: { fontSize: 20, color: COLORS.white, opacity: 0.8 },
  btnArrowSecondary: { fontSize: 20, color: COLORS.subtleGray },
  helpRow: { alignItems: 'center' },
  helpText: { fontSize: 13, color: COLORS.subtleGray },

  // ── Mobile layout ────────────────────────────────────────────────────────────
  mobileRoot: {
    flex: 1,
    backgroundColor: COLORS.primaryMaroon,
    justifyContent: 'center',
    padding: 24,
  },
  mobileCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: 36,
    alignItems: 'center',
    ...SHADOW.lg,
  },
  mobileLogo: { width: 90, height: 90, marginBottom: 20 },
  mobileTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.darkGray,
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  mobileSubtitle: {
    fontSize: 14,
    color: COLORS.subtleGray,
    marginBottom: 36,
    fontWeight: '500',
  },
  mobileActions: { width: '100%', gap: 12, marginBottom: 28 },
  btnPrimaryMobile: {
    ...COMMON_STYLES.btnPrimary,
    height: 54,
    width: '100%',
  },
  btnSecondaryMobile: {
    height: 54,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primaryMaroon,
    backgroundColor: COLORS.white,
  },
  mobileFooter: { fontSize: 12, color: COLORS.subtleGray, fontWeight: '500' },
});
