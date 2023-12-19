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
  <BasicPure> </BasicPure>
</template>
<script>
import { applyPureReactInVue } from 'veaury';
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
    return {
      foo: ref('Hello!'),
    };
  },
};
</script>