import { useWindowDimensions } from 'react-native';

// ── Brand colours ─────────────────────────────────────────────────────────────
export const COLORS = {
  primaryMaroon:  '#7A0019',
  maroonDark:     '#5C0013',
  maroonLight:    '#9B0020',
  gold:           '#C9A84C',
  goldLight:      '#F0D080',
  white:          '#FFFFFF',
  offWhite:       '#FAFBFC',
  lightGray:      '#F2F4F7',
  surfaceGray:    '#F8F9FB',
  mediumGray:     '#D0D5DD',
  borderGray:     '#E4E7EC',
  darkGray:       '#101828',
  bodyGray:       '#344054',
  subtleGray:     '#667085',
  error:          '#D92D20',
  errorLight:     '#FEF3F2',
  success:        '#027A48',
  successLight:   '#ECFDF3',
  warning:        '#B54708',
  warningLight:   '#FFFAEB',
  info:           '#026AA2',
  infoLight:      '#F0F9FF',
};

// ── Breakpoints ───────────────────────────────────────────────────────────────
export const BP = {
  sm:  480,
  md:  768,
  lg:  1024,
  xl:  1280,
};

// ── Hook — call inside a component to get layout helpers ─────────────────────
export function useResponsive() {
  const { width } = useWindowDimensions();
  return {
    width,
    isMobile:  width <  BP.md,
    isTablet:  width >= BP.md  && width < BP.lg,
    isDesktop: width >= BP.lg,
    isWide:    width >= BP.xl,
    // Content width: never wider than 1200px, horizontally centered
    contentWidth: Math.min(width, 1200),
    // Number of grid columns for queue cards
    cols: width >= BP.xl ? 3 : width >= BP.lg ? 2 : 1,
  };
}

// ── Shared design tokens ──────────────────────────────────────────────────────
export const RADIUS = { sm: 8, md: 12, lg: 16, xl: 24 };

export const SHADOW = {
  sm: {
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  lg: {
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
};

// ── Common styles (used across screens) ──────────────────────────────────────
export const COMMON_STYLES = {
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    padding: 24,
    marginBottom: 16,
    ...SHADOW.md,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 28,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
    ...SHADOW.sm,
  },
  headerText: {
    color: COLORS.darkGray,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  btnPrimary: {
    backgroundColor: COLORS.primaryMaroon,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primaryMaroon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  btnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.bodyGray,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.borderGray,
    borderRadius: RADIUS.md,
    padding: 14,
    fontSize: 15,
    color: COLORS.darkGray,
    backgroundColor: COLORS.white,
    marginBottom: 18,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.subtleGray,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
};
