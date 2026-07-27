import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store';
import { Colors, Spacing, BorderRadius, Decorations } from '../styles/theme';
import { BiblicalHeader, BiblicalCard } from './BiblicalComponents';

export default function AuthScreen() {
  const store = useAppStore();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = () => {
    if (!email || !password) {
      Alert.alert('Verification Required', 'Please fill in both email and password.');
      return;
    }
    if (isRegistering && !name) {
      Alert.alert('Verification Required', 'Please provide your name.');
      return;
    }

    if (isRegistering) {
      store.registerUser(name, email, rememberMe);
      Alert.alert('Grace be with you', `Account registered for ${name}!`);
    } else {
      store.signInUser(email, rememberMe);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logoText}>{Decorations.cross} S C A T T E R {Decorations.cross}</Text>
          <Text style={styles.ornament}>{Decorations.divider}</Text>
          <Text style={styles.subtitle}>Seminary Activity Tracker</Text>
        </View>

        <BiblicalCard variant="outlined" style={styles.card}>
          <Text style={styles.formTitle}>{isRegistering ? 'Register Instance' : 'Sign In To Instance'}</Text>
          <Text style={styles.formSubtitle}>
            {isRegistering
              ? 'Enter details to begin your theological stewardship'
              : 'Enter your credentials to resume your academic service'}
          </Text>

          {isRegistering && (
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Name</Text>
              <TextInput
                style={styles.formInput}
                value={name}
                onChangeText={setName}
                placeholder="e.g. John Calvin"
                placeholderTextColor={Colors.textTertiary}
              />
            </View>
          )}

          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Email Address</Text>
            <TextInput
              style={styles.formInput}
              value={email}
              onChangeText={setEmail}
              placeholder="e.g. calvin@seminary.edu"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Password</Text>
            <TextInput
              style={styles.formInput}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={Colors.textTertiary}
              secureTextEntry
            />
          </View>

          {/* Remember Me Checkbox */}
          <TouchableOpacity
            style={styles.rememberRow}
            onPress={() => setRememberMe(!rememberMe)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
              {rememberMe && <Ionicons name="checkmark" size={14} color={Colors.light} />}
            </View>
            <Text style={styles.rememberLabel}>Remember Me on this device</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
            <Text style={styles.submitBtnText}>
              {isRegistering ? 'Register & Begin' : 'Sign In'}
            </Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.light} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </BiblicalCard>

        <TouchableOpacity
          onPress={() => setIsRegistering(!isRegistering)}
          style={styles.toggleBtn}
        >
          <Text style={styles.toggleBtnText}>
            {isRegistering
              ? 'Already registered? Sign In instead'
              : "New to SCATTER? Register an initial account"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: 'Georgia',
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  ornament: {
    fontSize: 12,
    color: Colors.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    padding: Spacing.xl,
    borderColor: 'rgba(139, 111, 71, 0.4)',
    borderWidth: 1.5,
    backgroundColor: '#FAF7F2',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: 'Georgia',
    textAlign: 'center',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  formSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: Spacing.xl,
  },
  formField: {
    marginBottom: Spacing.lg,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  formInput: {
    backgroundColor: Colors.surface,
    borderColor: 'rgba(139, 111, 71, 0.3)',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 14,
    color: Colors.primary,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  checkboxChecked: {
    backgroundColor: Colors.secondary,
  },
  rememberLabel: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: Colors.secondary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: Colors.light,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  toggleBtn: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  toggleBtnText: {
    color: Colors.secondary,
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  },
});
