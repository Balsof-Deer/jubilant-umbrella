export const COLORS = {
  primaryMaroon: '#7A0019',
  primaryBlue: '#7A0019',
  secondaryLightBlue: '#66B2FF',
  secondaryGold: '#FFD700', // Actual gold color
  white: '#FFFFFF',
  offWhite: '#FDFDFD',
  lightGray: '#F5F7FA',
  mediumGray: '#E1E4E8',
  darkGray: '#24292E',
  error: '#D73A49',
  success: '#28A745',
  warning: '#FFC107',
  info: '#0366D6',
};

export const FONTS = {
  bold: 'System', 
  regular: 'System',
};

export const COMMON_STYLES = {
  card: {
    backgroundColor: '#FFFFFF', 
    padding: 20,
    borderRadius: 12, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E4E8', 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  headerText: {
    color: '#24292E', 
    fontSize: 22,
    fontWeight: '700',
  },
  btnPrimary: {
    backgroundColor: '#7A0019', 
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#7A0019',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
};
