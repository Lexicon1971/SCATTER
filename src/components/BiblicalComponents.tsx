import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../styles/theme';

interface DividerProps {
  style?: any;
  withOrnament?: boolean;
}

export const BiblicalDivider: React.FC<DividerProps> = ({ style, withOrnament = false }) => (
  <View style={[styles.divider, style]}>
    {withOrnament && <Text style={styles.ornament}>✦</Text>}
  </View>
);

interface HeaderProps {
  title: string;
  subtitle?: string;
  style?: any;
}

export const BiblicalHeader: React.FC<HeaderProps> = ({ title, subtitle, style }) => (
  <View style={[styles.header, style]}>
    <Text style={styles.title}>{title}</Text>
    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    <BiblicalDivider withOrnament />
  </View>
);

interface CardProps {
  children: React.ReactNode;
  style?: any;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const BiblicalCard: React.FC<CardProps> = ({ children, style, variant = 'default' }) => (
  <View style={[styles.card, styles[`card_${variant}`], style]}>
    {children}
  </View>
);

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  style?: any;
}

export const BiblicalBadge: React.FC<BadgeProps> = ({ label, variant = 'primary', style }) => (
  <View style={[styles.badge, styles[`badge_${variant}`], style]}>
    <Text style={styles.badgeText}>{label}</Text>
  </View>
);

interface SectionProps {
  title: string;
  children: React.ReactNode;
  style?: any;
}

export const BiblicalSection: React.FC<SectionProps> = ({ title, children, style }) => (
  <View style={[styles.section, style]}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <BiblicalDivider />
    {children}
  </View>
);

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: Colors.secondary,
    opacity: 0.3,
    marginVertical: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ornament: {
    fontSize: 12,
    color: Colors.secondary,
    textAlign: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.sm,
  },

  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.sm,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    fontStyle: 'italic',
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginVertical: Spacing.sm,
  },
  card_default: {
    borderWidth: 1,
    borderColor: 'rgba(139, 111, 71, 0.3)',
    backgroundColor: Colors.surface,
  },
  card_elevated: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
  },
  card_outlined: {
    borderWidth: 2,
    borderColor: Colors.secondary,
    backgroundColor: 'transparent',
  },

  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  badge_primary: {
    backgroundColor: Colors.primary,
  },
  badge_secondary: {
    backgroundColor: Colors.secondary,
  },
  badge_success: {
    backgroundColor: Colors.success,
  },
  badge_warning: {
    backgroundColor: Colors.warning,
  },
  badge_error: {
    backgroundColor: Colors.error,
  },
  badge_info: {
    backgroundColor: Colors.info,
  },
  badgeText: {
    color: Colors.light,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});