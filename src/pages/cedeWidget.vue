
<script lang="ts" setup>
import { renderSendWidget } from '@cedelabs/widgets-universal';
import useDarkMode from '@/composables/useDarkMode';

type SendWidgetTheme = {
  logoTheme?: 'dark' | 'light';
  fontFamily?: string;
  borderRadius?: number;
  width?: string;
  primaryColor?: string;
  primaryTextColor?: string;
  secondaryTextColor?: string;
  inputBorderColor?: string;
  borderColor?: string;
  errorColor?: string;
  warningColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  buttonTextColor?: string;
  deactivateButtonColor?: string;
};

onMounted(() => {
  const { darkMode } = useDarkMode();
  const widgetTheme: SendWidgetTheme = {
    logoTheme: 'light',
    borderRadius: 6,
    primaryColor: darkMode.value ? '#151526' : '#acb0ff',
    primaryTextColor: '#ffffff',
    secondaryTextColor: '#ffffff',
    secondaryColor: darkMode.value ? '#25284F' : '#acb0ff',
    borderColor: darkMode.value ? '#fefefe' : '#ffffff',
    accentColor: darkMode.value ? '#8a8dfc' : '#6162B0',
    buttonTextColor: darkMode.value ? '#fafafa' : '#fcf5f5',
  };
  const rootSelector = '#cede-widget';
  renderSendWidget(rootSelector, { theme: widgetTheme });
});
</script>
<template>
  <div id="cede-widget" />
</template>