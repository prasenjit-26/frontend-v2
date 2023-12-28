<!-- 
<template>
  <div>the children</div>
</template>
<script>
// import { ref } from 'vue';
// import { applyPureReactInVue } from 'veaury';
import { applyReactInVue } from 'veaury';
import { CedeSend } from '@cedelabs/widgets';

export default {
  components: {
    Cede: applyReactInVue(
      <CedeSend
        title="Lorem ipsum sit dolor amet"
        description="Lorem ipsum sit dolor amet"
        logo={null}
        navbarLogo={null}
        defaultScreen="custom"
      />
    ),
  },
};
</script> -->
<template>
  <BasicPure
    :theme="{
      logoTheme: 'light',
      borderRadius: 6,
      primaryColor: darkMode ? '#151526' : '#acb0ff',
      borderColor: darkMode ? '#000000' : '#ffffff',
      accentColor: '#8B8DFC',
      buttonTextColor: darkMode ? '#fafafa' : '#000000',
    }"
  >
  </BasicPure>
</template>
<script>
import { applyPureReactInVue } from 'veaury';
import useDarkMode from '@/composables/useDarkMode';
// This is a React component
import { CedeSend } from '@cedelabs/widgets';
import { ref } from 'vue';

export default {
  components: {
    // Use HOC 'applyReactInVue' or 'applyPureReactInVue'
    // Basic: applyReactInVue(BasicReactComponent),
    BasicPure: applyPureReactInVue(CedeSend),
  },
  setup() {
    const { darkMode } = useDarkMode();
    return {
      darkMode,
      foo: ref('Hello!'),
    };
  },
};
</script>